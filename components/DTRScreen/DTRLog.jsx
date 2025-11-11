"use client";
import { useAuth } from "@/contexts/AuthContexts";
import ApiService from "@/services/api";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const DTRLog = () => {
  const params = useLocalSearchParams();
  const { user } = useAuth();
  const [dtrData, setDtrData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [targetUserInfo, setTargetUserInfo] = useState(null);

  // Try to get user ID from params first, fallback to current user
  const targetUsrId = params.usrId || params.empId || user?.usrID;

  // Calculate pagination
  const totalPages = Math.ceil(dtrData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = dtrData.slice(startIndex, endIndex);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  useEffect(() => {
    if (!targetUsrId) {
      setLoading(false);
      setError("Cannot determine a user ID to fetch DTR records.");
      return;
    }

    const fetchUserDTR = async () => {
      try {
        setLoading(true);
        console.log("[DTRLog] ===== Starting DTR Fetch =====");
        console.log("[DTRLog] Raw params:", params);
        console.log("[DTRLog] Target usrId:", targetUsrId);
        console.log("[DTRLog] Type of targetUsrId:", typeof targetUsrId);

        const userIdToFetch = Number.parseInt(targetUsrId, 10);
        console.log("[DTRLog] Parsed userIdToFetch:", userIdToFetch);

        if (isNaN(userIdToFetch)) {
          throw new Error(`Invalid user ID: ${targetUsrId}`);
        }

        // Fetch DTR records
        console.log("[DTRLog] Calling API with userID:", userIdToFetch);
        const response = await ApiService.getDTRRecords(userIdToFetch);
        console.log(
          "[DTRLog] API Response:",
          JSON.stringify(response, null, 2)
        );

        if (response.success && response.data && response.data.length > 0) {
          const records = response.data;

          // Get target user info from the first record
          const firstRecord = records[0];
          const targetUserFullName = firstRecord.emp_name || "Unknown User";

          const targetUserAccId = firstRecord.acc_id;

          console.log("[DTRLog] Target user name:", targetUserFullName);
          console.log("[DTRLog] Target user accID:", targetUserAccId);

          // Fetch school name using the TARGET user's accID
          let schoolName = "Unknown School";
          if (targetUserAccId) {
            try {
              const schoolResponse = await ApiService.getSchool(
                targetUserAccId
              );
              console.log("[DTRLog] School API Response:", schoolResponse);

              if (schoolResponse.success && schoolResponse.data) {
                schoolName = schoolResponse.data.accName || "Unknown School";
                console.log("[DTRLog] School name:", schoolName);
              }
            } catch (schoolError) {
              console.error("[DTRLog] Error fetching school:", schoolError);
            }
          }

          // Store target user info
          setTargetUserInfo({
            name: targetUserFullName,
            school: schoolName,
            accId: targetUserAccId,
          });

          const formatTime = (datetime) => {
            if (!datetime) return "N/A";
            try {
              const d = new Date(datetime);
              return d.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
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

          const formattedData = records.map((record) => {
            return {
              id: record.tme_id || "N/A",
              name: targetUserFullName,
              school: schoolName,
              timeInAM: formatTime(record.tme_am_in),
              timeOutAM: formatTime(record.tme_am_out),
              timeInPM: formatTime(record.tme_pm_in),
              timeOutPM: formatTime(record.tme_pm_out),
              date: formatDate(record.tme_date),
              rawAccId: record.acc_id,
            };
          });

          console.log("[DTRLog] Formatted data sample:", formattedData[0]);
          console.log("[DTRLog] Total records:", formattedData.length);
          setDtrData(formattedData);
          setError(null);
        } else {
          throw new Error(response.message || "No DTR records found");
        }
      } catch (err) {
        console.error("[DTRLog] ===== ERROR =====");
        console.error("[DTRLog] Error type:", err.constructor.name);
        console.error("[DTRLog] Error message:", err.message);
        console.error("[DTRLog] Error stack:", err.stack);
        setError(`Failed to load DTR data: ${err.message || "Unknown error"}`);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDTR();
  }, [targetUsrId]);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#FF8C00" />
        <Text style={styles.loadingText}>Loading DTR records...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>⚠️ {error}</Text>
        <Text style={styles.debugText}>User ID: {targetUsrId}</Text>
      </View>
    );
  }

  if (dtrData.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyText}>No DTR records found.</Text>
      </View>
    );
  }

  const displayName = targetUserInfo?.name || "Employee";

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Cards Section */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.cardsScrollView}
      >
        <View style={styles.cardsContainer}>
          {/* Total Hours Card */}
          <View style={styles.card}>
            <View style={styles.cardContent}>
              <View style={styles.cardLeft}>
                <Text style={styles.cardTitle}>Total Hours</Text>
                <View style={styles.legendContainer}>
                  <View style={styles.legendItem}>
                    <View
                      style={[styles.legendDot, { backgroundColor: "#EF4444" }]}
                    />
                    <Text style={styles.legendText}>
                      Total Hours: <Text style={styles.legendValue}>160</Text>
                    </Text>
                  </View>
                  <View style={styles.legendItem}>
                    <View
                      style={[styles.legendDot, { backgroundColor: "#F97316" }]}
                    />
                    <Text style={styles.legendText}>
                      Overtime: <Text style={styles.legendValue}>8</Text>
                    </Text>
                  </View>
                </View>
                <View style={styles.cardDivider} />
                <Text style={styles.monthText}>
                  Total Hours of the Month:{" "}
                  <Text style={styles.monthValue}>322</Text>
                </Text>
              </View>
              <View style={styles.chartPlaceholder}>
                <View style={styles.chartInner} />
              </View>
            </View>
          </View>

          {/* Attendance Summary Card */}
          <View style={styles.card}>
            <View style={styles.cardContent}>
              <View style={styles.cardLeft}>
                <Text style={styles.cardTitle}>Attendance Summary</Text>
                <View style={styles.legendContainer}>
                  <View style={styles.legendItem}>
                    <View
                      style={[styles.legendDot, { backgroundColor: "#22C55E" }]}
                    />
                    <Text style={styles.legendText}>
                      Days Present: <Text style={styles.legendValue}>18</Text>
                    </Text>
                  </View>
                  <View style={styles.legendItem}>
                    <View
                      style={[styles.legendDot, { backgroundColor: "#EF4444" }]}
                    />
                    <Text style={styles.legendText}>
                      Days Absent: <Text style={styles.legendValue}>2</Text>
                    </Text>
                  </View>
                </View>
              </View>
              <View
                style={[
                  styles.chartPlaceholder,
                  { backgroundColor: "#22C55E" },
                ]}
              >
                <View style={styles.chartInner} />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Table Section */}
      <Text style={styles.headerTitle}>DTR Log for {displayName}</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tableScroll}
      >
        <View style={styles.table}>
          {/* Table Header */}
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.tableHeader, { width: 80 }]}>
              ID
            </Text>
            <Text
              style={[styles.tableCell, styles.tableHeader, { width: 200 }]}
            >
              Name
            </Text>
            <Text
              style={[styles.tableCell, styles.tableHeader, { width: 170 }]}
            >
              School
            </Text>
            <Text
              style={[styles.tableCell, styles.tableHeader, { width: 140 }]}
            >
              Time In (AM)
            </Text>
            <Text
              style={[styles.tableCell, styles.tableHeader, { width: 140 }]}
            >
              Time Out (PM)
            </Text>
            <Text
              style={[styles.tableCell, styles.tableHeader, { width: 120 }]}
            >
              Date
            </Text>
          </View>

          {/* Table Rows */}
          {currentData.map((item, index) => (
            <View
              key={index}
              style={[styles.tableRow, index % 2 !== 0 && styles.tableRowAlt]}
            >
              <Text style={[styles.tableCell, { width: 80 }]}>{item.id}</Text>
              <Text style={[styles.tableCell, { width: 200 }]}>
                {item.name}
              </Text>
              <Text style={[styles.tableCell, { width: 170 }]}>
                {item.school}
              </Text>
              <Text style={[styles.tableCell, { width: 140 }]}>
                {item.timeInAM}
              </Text>
              <Text style={[styles.tableCell, { width: 140 }]}>
                {item.timeOutPM}
              </Text>
              <Text style={[styles.tableCell, { width: 120 }]}>
                {item.date}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>

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
          Page {currentPage} of {totalPages || 1}
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
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#666",
  },
  errorText: {
    fontSize: 14,
    color: "#EF4444",
    textAlign: "center",
    marginBottom: 8,
  },
  debugText: {
    fontSize: 12,
    color: "#999",
    textAlign: "center",
  },
  emptyText: {
    fontSize: 14,
    color: "#999",
  },
  cardsScrollView: {
    marginBottom: 24,
  },
  cardsContainer: {
    flexDirection: "row",
    gap: 16,
    paddingRight: 16,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    padding: 16,
    minWidth: 300,
  },
  cardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  cardLeft: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4B5563",
    marginBottom: 16,
  },
  legendContainer: {
    gap: 12,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontSize: 12,
    color: "#374151",
  },
  legendValue: {
    fontWeight: "600",
  },
  cardDivider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 16,
  },
  monthText: {
    fontSize: 12,
    color: "#4B5563",
  },
  monthValue: {
    fontWeight: "700",
    color: "#111827",
  },
  chartPlaceholder: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#EF4444",
    justifyContent: "center",
    alignItems: "center",
  },
  chartInner: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#FFFFFF",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  tableScroll: {
    marginBottom: 24,
  },
  table: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    overflow: "hidden",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
  },
  tableRowAlt: {
    backgroundColor: "#F9FAFB",
  },
  tableCell: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    fontSize: 12,
    color: "#374151",
    borderRightWidth: 1,
    borderRightColor: "#E5E7EB",
  },
  tableHeader: {
    backgroundColor: "#FF8C00",
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 13,
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
});

export default DTRLog;
