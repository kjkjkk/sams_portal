"use client";
import { useAuth } from "@/contexts/AuthContexts";
import ApiService from "@/services/api";
import { isAdminUser } from "@/utils/roleUtils";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

const DTRTable = () => {
  const { user, loading: authLoading } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [allDtrData, setAllDtrData] = useState([]);
  const [dtrData, setDtrData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalRecords, setTotalRecords] = useState(0);
  const [selectedUserType, setSelectedUserType] = useState("all");
  const [userTypes, setUserTypes] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log("[DTRTable] Fetching all DTR records...");

        // Fetch DTR records
        const dtrResponse = await ApiService.getAllDTRRecords();

        if (dtrResponse.success && dtrResponse.data) {
          const records = dtrResponse.data;

          const formattedData = records.map((record) => {
            const formatTime = (datetime) => {
              if (!datetime) return "N/A";
              try {
                const d = new Date(datetime);
                return d.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                });
              } catch {
                return datetime;
              }
            };

            const formatDate = (datetime) => {
              if (!datetime) return "N/A";
              try {
                const d = new Date(datetime);
                return d.toISOString().split("T")[0];
              } catch {
                return datetime;
              }
            };

            return {
              id: record.tme_id || "N/A",
              emp_name: record.emp_name || "Unknown",
              emp_id: record.emp_id,
              usr_id: record.usr_id,
              user_type: record.user_type || "unknown",
              user_type_name: record.user_type_name || "Unknown",
              date: formatDate(record.tme_date),
              timeInAM: formatTime(record.tme_am_in),
              timeOutAM: formatTime(record.tme_am_out),
              timeInPM: formatTime(record.tme_pm_in),
              timeOutPM: formatTime(record.tme_pm_out),
              regTotal: record.tme_reg_total || 0,
              remarks: record.tme_remarks || "—",
            };
          });

          setAllDtrData(formattedData);
          setTotalRecords(formattedData.length);

          // Extract unique user types
          const uniqueTypes = [
            ...new Set(formattedData.map((d) => d.user_type_name)),
          ];
          setUserTypes(uniqueTypes);

          setError(null);
        } else {
          throw new Error(dtrResponse.message || "Failed to fetch DTR records");
        }
      } catch (err) {
        console.error("[DTRTable] Fetch error:", err);
        setError(`Failed to load DTR data: ${err.message || "Unknown error"}`);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading && user && isAdminUser(user.usrType)) {
      fetchData();
    }
  }, [authLoading, user]);

  useEffect(() => {
    let filteredData = allDtrData;

    if (selectedUserType !== "all") {
      filteredData = allDtrData.filter(
        (item) => item.user_type_name === selectedUserType
      );
    }

    setTotalRecords(filteredData.length);

    // Apply pagination
    const startIndex = (currentPage - 1) * rowsPerPage;
    const paginatedData = filteredData.slice(
      startIndex,
      startIndex + rowsPerPage
    );
    setDtrData(paginatedData);
  }, [selectedUserType, currentPage, rowsPerPage, allDtrData]);

  const handleViewUser = (usrId) => {
    router.push({
      pathname: "/screens/dtrlogs",
      params: { usrId: String(usrId) },
    });
  };

  const totalPages = Math.ceil(totalRecords / rowsPerPage) || 1;

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  if (authLoading || loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#FF8C00" />
        <Text style={styles.loadingText}>Loading DTR records...</Text>
      </View>
    );
  }

  if (!authLoading && user && !isAdminUser(user.usrType)) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>
          You do not have permission to view all DTR records.
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (allDtrData.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyText}>No DTR records found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Table Section */}
      <View style={styles.table}>
        {/* Table Header */}
        <View style={styles.tableRow}>
          <Text style={[styles.tableCell, styles.tableHeader, { width: 50 }]}>
            ID
          </Text>
          <Text style={[styles.tableCell, styles.tableHeader, { width: 120 }]}>
            Employee
          </Text>
          <Text style={[styles.tableCell, styles.tableHeader, { width: 90 }]}>
            Type
          </Text>
          <Text style={[styles.tableCell, styles.tableHeader, { width: 90 }]}>
            Date
          </Text>
          <Text style={[styles.tableCell, styles.tableHeader, { width: 80 }]}>
            Time In (AM)
          </Text>
          <Text style={[styles.tableCell, styles.tableHeader, { width: 80 }]}>
            Time Out (AM)
          </Text>
          <Text style={[styles.tableCell, styles.tableHeader, { width: 80 }]}>
            Time In (PM)
          </Text>
          <Text style={[styles.tableCell, styles.tableHeader, { width: 80 }]}>
            Time Out (PM)
          </Text>
          <Text style={[styles.tableCell, styles.tableHeader, { width: 100 }]}>
            Total Hours
          </Text>
          <Text style={[styles.tableCell, styles.tableHeader, { width: 80 }]}>
            Actions
          </Text>
        </View>

        {/* Table Rows */}
        {dtrData.map((item, index) => (
          <View
            key={item.id + index}
            style={[styles.tableRow, index % 2 === 0 && styles.tableRowAlt]}
          >
            <Text style={[styles.tableCell, { width: 50 }]}>{item.id}</Text>
            <Text style={[styles.tableCell, { width: 120 }]}>
              {item.emp_name}
            </Text>
            <Text style={[styles.tableCell, { width: 90 }]}>
              {item.user_type_name}
            </Text>
            <Text style={[styles.tableCell, { width: 90 }]}>{item.date}</Text>
            <Text style={[styles.tableCell, { width: 80 }]}>
              {item.timeInAM}
            </Text>
            <Text style={[styles.tableCell, { width: 80 }]}>
              {item.timeOutAM}
            </Text>
            <Text style={[styles.tableCell, { width: 80 }]}>
              {item.timeInPM}
            </Text>
            <Text style={[styles.tableCell, { width: 80 }]}>
              {item.timeOutPM}
            </Text>
            <Text style={[styles.tableCell, { width: 100 }]}>
              {item.regTotal}
            </Text>
            <View
              style={[
                styles.tableCell,
                {
                  width: 80,
                  flexDirection: "row",
                  justifyContent: "center",
                  gap: 8,
                },
              ]}
            >
              <Pressable
                style={styles.actionButton}
                onPress={() => handleViewUser(item.usr_id)}
              >
                <Text style={styles.actionButtonText}>👁️</Text>
              </Pressable>
              <Pressable
                style={styles.actionButton}
                onPress={() => handleViewUser(item.usr_id)}
              >
                <Text style={styles.actionButtonText}>✏️</Text>
              </Pressable>
            </View>
          </View>
        ))}
      </View>

      {/* Pagination Controls */}
      <View style={styles.paginationContainer}>
        <Pressable
          style={[
            styles.paginationButton,
            currentPage === 1 && styles.paginationButtonDisabled,
          ]}
          onPress={handlePreviousPage}
          disabled={currentPage === 1}
        >
          <Text style={styles.paginationButtonText}>Previous</Text>
        </Pressable>
        <Text style={styles.pageInfo}>
          Page {currentPage} of {totalPages}
        </Text>
        <Pressable
          style={[
            styles.paginationButton,
            currentPage === totalPages && styles.paginationButtonDisabled,
          ]}
          onPress={handleNextPage}
          disabled={currentPage === totalPages}
        >
          <Text style={styles.paginationButtonText}>Next</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fafafaff",
    padding: 16,
  },
  filterScroll: {
    marginBottom: 16,
  },
  filterContainer: {
    flexDirection: "row",
    gap: 8,
    paddingRight: 16,
  },
  filterButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: "#E5E7EB",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },
  filterButtonActive: {
    backgroundColor: "#FF8C00",
    borderColor: "#FF8C00",
  },
  filterButtonText: {
    fontSize: 12,
    color: "#4B5563",
    fontWeight: "500",
  },
  filterButtonTextActive: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  tableScroll: {
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 16,
  },
  table: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    overflow: "hidden",
  },
  tableHeader: {
    backgroundColor: "#FF8C00",
    color: "#FFFFFF",
    fontWeight: "600",
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  tableCell: {
    fontSize: 12,
    color: "#111827",
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRightWidth: 1,
    borderRightColor: "#E5E7EB",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
  },
  tableRowAlt: {
    backgroundColor: "#fafafa",
  },
  actionButton: {
    paddingHorizontal: 6,
    paddingVertical: 4,
    backgroundColor: "#F0F0F0",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  actionButtonText: {
    fontSize: 14,
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  paginationButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#FF8C00",
    borderRadius: 6,
  },
  paginationButtonDisabled: {
    backgroundColor: "#D1D5DB",
  },
  paginationButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  pageInfo: {
    fontSize: 12,
    color: "#4B5563",
    fontWeight: "500",
  },
  centerContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  errorText: {
    fontSize: 16,
    color: "#FF0000",
    textAlign: "center",
  },
  loadingText: {
    fontSize: 14,
    color: "#666",
    marginTop: 8,
  },
  emptyText: {
    fontSize: 14,
    color: "#999",
  },
});

export default DTRTable;
