"use client";
import { useAuth } from "@/contexts/AuthContexts";
import ApiService from "@/services/api";
import { isAdminUser } from "@/utils/roleUtils";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const DTRTable = ({ selectedUserType, searchText }) => {
  const { user, loading: authLoading } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [displayedUsers, setDisplayedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log("[DTRTable] ===== Fetching all DTR records =====");

        // Fetch DTR records
        const dtrResponse = await ApiService.getAllDTRRecords();
        console.log("[DTRTable] API Response received");

        if (dtrResponse.success && dtrResponse.data) {
          const records = dtrResponse.data;
          console.log("[DTRTable] Total records received:", records.length);

          // Group records by user to get unique users
          const userMap = new Map();

          records.forEach((record) => {
            const userId = record.emp_id || record.usr_id;

            if (!userMap.has(userId)) {
              userMap.set(userId, {
                usr_id: userId,
                emp_name: record.emp_name || record.user_name || "Unknown",
                school_name:
                  record.school_name || record.acc_name || "Unknown School",
                acc_id: record.acc_id,
                user_type: record.user_type || record.usrType,
                user_type_name:
                  record.user_type_name || record.type_name || "Unknown",
                total_records: 1,
                latest_date: record.tme_date,
              });
            } else {
              // Increment record count for this user
              const existing = userMap.get(userId);
              existing.total_records += 1;

              // Update to latest date if newer
              if (new Date(record.tme_date) > new Date(existing.latest_date)) {
                existing.latest_date = record.tme_date;
              }
            }
          });

          // Convert map to array
          const uniqueUsers = Array.from(userMap.values());
          console.log("[DTRTable] Unique users:", uniqueUsers.length);
          console.log("[DTRTable] Sample user data:", uniqueUsers.slice(0, 2));

          setAllUsers(uniqueUsers);
          setError(null);
        } else {
          throw new Error(dtrResponse.message || "Failed to fetch DTR records");
        }
      } catch (err) {
        console.error("[DTRTable] ===== ERROR =====");
        console.error("[DTRTable] Error message:", err.message);
        setError(`Failed to load DTR data: ${err.message || "Unknown error"}`);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading && user && isAdminUser(user.usrType)) {
      fetchData();
    } else if (!authLoading && user && !isAdminUser(user.usrType)) {
      setLoading(false);
    }
  }, [authLoading, user]);

  useEffect(() => {
    console.log("[DTRTable] Filter effect triggered");
    console.log("[DTRTable] selectedUserType:", selectedUserType);
    console.log("[DTRTable] searchText:", searchText);
    console.log("[DTRTable] allUsers count:", allUsers.length);

    let filtered = [...allUsers];

    // Filter by user type (if selectedUserType is not null/"All")
    if (selectedUserType !== null && selectedUserType !== undefined) {
      console.log("[DTRTable] Filtering by user type:", selectedUserType);
      const beforeFilter = filtered.length;

      filtered = filtered.filter((item) => {
        const matches = Number(item.user_type) === Number(selectedUserType);
        if (!matches && beforeFilter < 20) {
          console.log(
            `[DTRTable] User ${item.emp_name}: user_type=${item.user_type} vs selectedUserType=${selectedUserType}`
          );
        }
        return matches;
      });

      console.log(
        `[DTRTable] After user type filter: ${beforeFilter} -> ${filtered.length}`
      );
    }

    // Filter by search text
    if (searchText && searchText.trim() !== "") {
      console.log("[DTRTable] Filtering by search text:", searchText);
      const searchLower = searchText.toLowerCase();
      const beforeSearch = filtered.length;

      filtered = filtered.filter((item) => {
        const name = item.emp_name?.toLowerCase() || "";
        const school = item.school_name?.toLowerCase() || "";
        const type = item.user_type_name?.toLowerCase() || "";
        const id = String(item.usr_id || "");

        return (
          name.includes(searchLower) ||
          school.includes(searchLower) ||
          type.includes(searchLower) ||
          id.includes(searchLower)
        );
      });

      console.log(
        `[DTRTable] After search filter: ${beforeSearch} -> ${filtered.length}`
      );
    }

    setFilteredUsers(filtered);

    // Apply pagination
    const startIndex = (currentPage - 1) * rowsPerPage;
    const paginated = filtered.slice(startIndex, startIndex + rowsPerPage);
    setDisplayedUsers(paginated);

    console.log(
      `[DTRTable] Displaying ${paginated.length} users on page ${currentPage}`
    );

    // Reset to page 1 if current page exceeds total pages
    const totalPages = Math.ceil(filtered.length / rowsPerPage);
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [selectedUserType, searchText, currentPage, rowsPerPage, allUsers]);

  const handleViewUser = (userId) => {
    console.log("[DTRTable] ===== Navigating to DTR logs =====");
    console.log("[DTRTable] userId:", userId);

    if (!userId) {
      console.error("[DTRTable] No valid user ID found!");
      return;
    }

    router.push({
      pathname: "/screens/dtrlogs",
      params: {
        usrId: String(userId),
      },
    });
  };

  const totalPages = Math.ceil(filteredUsers.length / rowsPerPage) || 1;

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

  const formatDate = (datetime) => {
    if (!datetime) return "N/A";
    try {
      const d = new Date(datetime);
      return d.toISOString().split("T")[0];
    } catch {
      return "N/A";
    }
  };

  if (authLoading || loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#F97316" />
        <Text style={styles.loadingText}>Loading users...</Text>
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

  if (allUsers.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyText}>No users found</Text>
      </View>
    );
  }

  if (filteredUsers.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyText}>
          No users match your search criteria
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.cardsScrollView}
      >
        {/* Table Section */}
        <View style={styles.table}>
          {/* Table Header */}
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.tableHeader, { width: 80 }]}>
              User ID
            </Text>
            <Text
              style={[styles.tableCell, styles.tableHeader, { width: 200 }]}
            >
              Name
            </Text>
            <Text
              style={[styles.tableCell, styles.tableHeader, { width: 160 }]}
            >
              School
            </Text>
            <Text
              style={[styles.tableCell, styles.tableHeader, { width: 120 }]}
            >
              User Type
            </Text>
            <Text
              style={[styles.tableCell, styles.tableHeader, { width: 100 }]}
            >
              Total Records
            </Text>
            <Text
              style={[styles.tableCell, styles.tableHeader, { width: 100 }]}
            >
              Latest Log
            </Text>
            <Text style={[styles.tableCell, styles.tableHeader, { width: 80 }]}>
              Actions
            </Text>
          </View>

          {/* Table Rows */}
          {displayedUsers.map((item, index) => (
            <View
              key={`user-${item.usr_id}-${index}`}
              style={[styles.tableRow, index % 2 === 1 && styles.tableRowAlt]}
            >
              <Text style={[styles.tableCell, { width: 80 }]}>
                {item.usr_id}
              </Text>
              <Text style={[styles.tableCell, { width: 200 }]}>
                {item.emp_name}
              </Text>
              <Text style={[styles.tableCell, { width: 160 }]}>
                {item.school_name}
              </Text>
              <Text style={[styles.tableCell, { width: 120 }]}>
                {item.user_type_name}
              </Text>
              <Text style={[styles.tableCell, { width: 100 }]}>
                {item.total_records}
              </Text>
              <Text style={[styles.tableCell, { width: 100 }]}>
                {formatDate(item.latest_date)}
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
              </View>
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
          Page {currentPage} of {totalPages} ({filteredUsers.length} users)
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  table: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
  },
  tableHeader: {
    backgroundColor: "#F97316",
    color: "#FFFFFF",
    fontWeight: "600",
    paddingVertical: 12,
    paddingHorizontal: 8,
    fontSize: 13,
  },
  tableCell: {
    fontSize: 12,
    color: "#374151",
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
    backgroundColor: "#F9FAFB",
  },
  actionButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "#F97316",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  actionButtonText: {
    fontSize: 12,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
  },
  paginationButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#F97316",
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
    minHeight: 200,
  },
  errorText: {
    fontSize: 14,
    color: "#EF4444",
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
