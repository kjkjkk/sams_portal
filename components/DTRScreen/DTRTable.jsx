"use client";
import { useAuth } from "@/contexts/AuthContexts";
import { useTheme } from "@/contexts/ThemeContext";
import ApiService from "@/services/api";
import { isLMSAdminUser, isSuperAdminUser } from "@/utils/roleUtils";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const DTRTable = ({
  selectedUserType,
  searchText,
  appliedFromDate,
  appliedToDate,
  selectedSchool, // This will come from parent, but we'll override for LMS
}) => {
  const { user, loading: authLoading } = useAuth();
  const { theme } = useTheme();
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [displayedUsers, setDisplayedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  const styles = useMemo(() => createStyles(theme), [theme]);

  // ✅ Determine effective school filter based on user role
  const effectiveSchoolFilter = useMemo(() => {
    if (isLMSAdminUser(user?.usrType)) {
      // LMS Admin can only see their own school
      return user?.accID;
    }
    // Super Admin can see all or selected school
    return selectedSchool;
  }, [user?.usrType, user?.accID, selectedSchool]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log(
          "[DTRTable] ===== Fetching ALL USERS with DTR summary ====="
        );
        console.log("[DTRTable] Current user:", {
          usrID: user?.usrID,
          usrType: user?.usrType,
          accID: user?.accID,
          isLMS: isLMSAdminUser(user?.usrType),
          isSuperAdmin: isSuperAdminUser(user?.usrType),
        });

        // ✅ Use the NEW endpoint that returns ALL users
        console.log("[DTRTable] Calling getAllUsersWithDTR()...");
        const response = await ApiService.getAllUsersWithDTR();
        console.log("[DTRTable] API Response received:", response);

        if (response.success && response.data) {
          const users = response.data;
          console.log("[DTRTable] ✅ Total users received:", users.length);

          // ✅ Log sample user to verify structure
          if (users.length > 0) {
            console.log("[DTRTable] Sample user:", users[0]);
          }

          // ✅ Log user types
          const userTypes = [...new Set(users.map((u) => u.user_type))];
          console.log("[DTRTable] Unique user types:", userTypes);

          // ✅ Count by type
          const typeCount = {};
          users.forEach((u) => {
            const typeName = u.user_type_name || "Unknown";
            typeCount[typeName] = (typeCount[typeName] || 0) + 1;
          });
          console.log("[DTRTable] Users by type:", typeCount);

          setAllUsers(users);
          setError(null);
        } else {
          console.error("[DTRTable] ❌ API returned success=false");
          throw new Error(response.message || "Failed to fetch users");
        }
      } catch (err) {
        console.error("[DTRTable] ❌ ERROR:", err);
        console.error("[DTRTable] Error stack:", err.stack);
        setError(`Failed to load user data: ${err.message}`);
        setAllUsers([]); // ✅ Set empty array on error
      } finally {
        console.log("[DTRTable] Setting loading to false");
        setLoading(false);
      }
    };

    if (!authLoading && user) {
      const canViewDTR =
        isSuperAdminUser(user.usrType) || isLMSAdminUser(user.usrType);
      console.log(
        "[DTRTable] Auth check - canViewDTR:",
        canViewDTR,
        "userType:",
        user.usrType
      );

      if (canViewDTR) {
        console.log("[DTRTable] ✅ User has permission, fetching data...");
        fetchData();
      } else {
        console.log("[DTRTable] ❌ User does not have permission");
        setLoading(false);
      }
    } else {
      console.log("[DTRTable] Waiting for auth...", {
        authLoading,
        hasUser: !!user,
      });
    }
  }, [authLoading, user]);

  // ✅ Filter logic - now uses effectiveSchoolFilter
  useEffect(() => {
    console.log("[DTRTable] ===== Applying Filters =====");
    console.log("[DTRTable] Total users before filter:", allUsers.length);
    console.log("[DTRTable] Filters:", {
      selectedUserType,
      effectiveSchoolFilter,
      searchText,
      appliedFromDate,
      appliedToDate,
      userRole: isLMSAdminUser(user?.usrType) ? "LMS Admin" : "Super Admin",
    });

    let filtered = [...allUsers];

    // 1. School Filter (automatically applied for LMS, optional for Super Admin)
    if (effectiveSchoolFilter !== null && effectiveSchoolFilter !== undefined) {
      console.log("[DTRTable] Filtering by school:", effectiveSchoolFilter);
      const beforeCount = filtered.length;

      filtered = filtered.filter((item) => {
        return Number(item.acc_id) === Number(effectiveSchoolFilter);
      });

      console.log(
        `[DTRTable] After school filter: ${filtered.length} (was ${beforeCount})`
      );
    }

    // 2. User Type Filter
    if (selectedUserType !== null && selectedUserType !== undefined) {
      console.log("[DTRTable] Filtering by user type:", selectedUserType);
      const beforeCount = filtered.length;

      filtered = filtered.filter((item) => {
        return Number(item.user_type) === Number(selectedUserType);
      });

      console.log(
        `[DTRTable] After user type filter: ${filtered.length} (was ${beforeCount})`
      );

      if (filtered.length > 0) {
        console.log(
          "[DTRTable] Sample matched users:",
          filtered.slice(0, 3).map((u) => ({
            name: u.emp_name,
            type: u.user_type,
            typeName: u.user_type_name,
          }))
        );
      }
    }

    // 3. Search Text Filter
    if (searchText && searchText.trim() !== "") {
      const searchLower = searchText.toLowerCase();
      const beforeCount = filtered.length;

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
        `[DTRTable] After search filter: ${filtered.length} (was ${beforeCount})`
      );
    }

    // 4. Date Range Filter (only filters users who have latest_date)
    if (appliedFromDate || appliedToDate) {
      const beforeCount = filtered.length;

      filtered = filtered.filter((item) => {
        // ✅ Keep users without DTR records
        if (!item.latest_date) return true;

        const recordDate = new Date(item.latest_date);
        recordDate.setHours(0, 0, 0, 0);

        if (appliedFromDate) {
          const fromDate = new Date(appliedFromDate);
          fromDate.setHours(0, 0, 0, 0);
          if (recordDate < fromDate) return false;
        }

        if (appliedToDate) {
          const toDate = new Date(appliedToDate);
          toDate.setHours(0, 0, 0, 0);
          if (recordDate > toDate) return false;
        }

        return true;
      });

      console.log(
        `[DTRTable] After date filter: ${filtered.length} (was ${beforeCount})`
      );
    }

    console.log(
      "[DTRTable] ===== Final filtered count:",
      filtered.length,
      "====="
    );

    setFilteredUsers(filtered);

    // Paginate
    const startIndex = (currentPage - 1) * rowsPerPage;
    const paginated = filtered.slice(startIndex, startIndex + rowsPerPage);
    setDisplayedUsers(paginated);

    // Reset to page 1 if current page is now out of range
    const totalPages = Math.ceil(filtered.length / rowsPerPage);
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [
    selectedUserType,
    searchText,
    appliedFromDate,
    appliedToDate,
    effectiveSchoolFilter, // ✅ Now uses effectiveSchoolFilter instead of selectedSchool
    currentPage,
    rowsPerPage,
    allUsers,
    user,
  ]);

  const handleViewUser = (userId) => {
    if (!userId) {
      console.error("[DTRTable] No valid user ID!");
      return;
    }
    router.push({
      pathname: "/screens/dtrlogs",
      params: { usrId: String(userId) },
    });
  };

  const totalPages = Math.ceil(filteredUsers.length / rowsPerPage) || 1;

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const formatDate = (datetime) => {
    if (!datetime) return "No logs yet";
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

  const canViewDTR =
    isSuperAdminUser(user?.usrType) || isLMSAdminUser(user?.usrType);

  if (!authLoading && user && !canViewDTR) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>
          You do not have permission to view DTR records.
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
        <Text style={styles.emptySubtext}>No active users in the system</Text>
      </View>
    );
  }

  if (filteredUsers.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyText}>No users match your filters</Text>
        <Text style={styles.emptySubtext}>
          Try adjusting your search criteria
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
              style={[styles.tableCell, styles.tableHeader, { width: 120 }]}
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
              <Text style={[styles.tableCell, { width: 120 }]}>
                {item.user_type_name}
              </Text>
              <Text style={[styles.tableCell, { width: 100 }]}>
                {item.total_records || 0}
              </Text>
              <Text style={[styles.tableCell, { width: 120 }]}>
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

const createStyles = (theme) =>
  StyleSheet.create({
    container: { flex: 1, width: "100%", paddingBottom: 24 },
    table: {
      borderWidth: 1,
      borderColor: "#E5E7EB",
      borderRadius: 8,
      overflow: "hidden",
      backgroundColor: "#FFFFFF",
    },
    tableHeader: {
      backgroundColor: theme.cardHeader,
      color: theme.buttonText,
      fontWeight: "600",
      paddingVertical: 12,
      paddingHorizontal: 8,
      fontSize: 13,
    },
    tableCell: {
      fontSize: 12,
      color: theme.contentText,
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
    tableRowAlt: { backgroundColor: "#F9FAFB" },
    actionButton: {
      paddingHorizontal: 10,
      paddingVertical: 6,
      backgroundColor: theme.buttonHover,
      borderRadius: 4,
      justifyContent: "center",
      alignItems: "center",
    },
    actionButtonText: {
      fontSize: 12,
      color: theme.buttonText,
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
      backgroundColor: theme.buttonHover,
      borderRadius: 6,
    },
    paginationButtonDisabled: { backgroundColor: "#D1D5DB" },
    paginationButtonText: {
      color: theme.buttonText,
      fontSize: 12,
      fontWeight: "600",
    },
    pageInfo: { fontSize: 12, color: "#4B5563", fontWeight: "500" },
    centerContainer: {
      justifyContent: "center",
      alignItems: "center",
      padding: 24,
      minHeight: 200,
    },
    errorText: { fontSize: 14, color: "#EF4444", textAlign: "center" },
    loadingText: { fontSize: 14, color: "#666", marginTop: 8 },
    emptyText: { fontSize: 14, color: "#999", fontWeight: "600" },
    emptySubtext: { fontSize: 12, color: "#CCC", marginTop: 4 },
    cardsScrollView: { marginBottom: 16 },
  });

export default DTRTable;
