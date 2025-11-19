"use client";
import { useAuth } from "@/contexts/AuthContexts";
import { useTheme } from "@/contexts/ThemeContext"; // Add this import
import ApiService from "@/services/api";
import { isAdminUser } from "@/utils/roleUtils";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react"; // Add useMemo
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
  const { theme } = useTheme(); // Get theme from context
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [displayedUsers, setDisplayedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  // Create dynamic styles based on theme
  const styles = useMemo(() => createStyles(theme), [theme]);

  // ... rest of your existing useEffect hooks and functions remain the same ...

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log("[DTRTable] ===== Fetching all DTR records =====");

        const dtrResponse = await ApiService.getAllDTRRecords();
        console.log("[DTRTable] API Response received");

        if (dtrResponse.success && dtrResponse.data) {
          const records = dtrResponse.data;
          console.log("[DTRTable] Total records received:", records.length);

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
              const existing = userMap.get(userId);
              existing.total_records += 1;

              if (new Date(record.tme_date) > new Date(existing.latest_date)) {
                existing.latest_date = record.tme_date;
              }
            }
          });

          const uniqueUsers = Array.from(userMap.values());
          console.log("[DTRTable] Unique users:", uniqueUsers.length);

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
    let filtered = [...allUsers];

    if (selectedUserType !== null && selectedUserType !== undefined) {
      filtered = filtered.filter((item) => {
        return Number(item.user_type) === Number(selectedUserType);
      });
    }

    if (searchText && searchText.trim() !== "") {
      const searchLower = searchText.toLowerCase();
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
    }

    setFilteredUsers(filtered);

    const startIndex = (currentPage - 1) * rowsPerPage;
    const paginated = filtered.slice(startIndex, startIndex + rowsPerPage);
    setDisplayedUsers(paginated);

    const totalPages = Math.ceil(filtered.length / rowsPerPage);
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [selectedUserType, searchText, currentPage, rowsPerPage, allUsers]);

  const handleViewUser = (userId) => {
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
        <ActivityIndicator size="large" color={theme.primary} />
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
        <View style={styles.table}>
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

// Move styles to a function that accepts theme
const createStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      width: "100%",
      paddingBottom: 24,
    },
    table: {
      borderWidth: 1,
      borderColor: "#E5E7EB",
      borderRadius: 8,
      overflow: "hidden",
      backgroundColor: "#FFFFFF",
    },
    tableHeader: {
      backgroundColor: theme.cardHeader, // Dynamic theme color
      color: theme.buttonText, // Dynamic theme color
      fontWeight: "600",
      paddingVertical: 12,
      paddingHorizontal: 8,
      fontSize: 13,
    },
    tableCell: {
      fontSize: 12,
      color: theme.contentText, // Dynamic theme color
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
      backgroundColor: theme.buttonHover, // Dynamic theme color
      borderRadius: 4,
      justifyContent: "center",
      alignItems: "center",
    },
    actionButtonText: {
      fontSize: 12,
      color: theme.buttonText, // Dynamic theme color
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
      backgroundColor: theme.buttonHover, // Dynamic theme color
      borderRadius: 6,
    },
    paginationButtonDisabled: {
      backgroundColor: "#D1D5DB",
    },
    paginationButtonText: {
      color: theme.buttonText, // Dynamic theme color
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
