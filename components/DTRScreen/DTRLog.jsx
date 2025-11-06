"use client";
import { useAuth } from "@/contexts/AuthContexts";
import ApiService from "@/services/api";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const DTRLog = () => {
  const params = useLocalSearchParams();
  const { user } = useAuth(); // Get the authenticated user object
  const [dtrData, setDtrData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1. Construct the Full Name from the local 'user' object
  const authenticatedUserFullName =
    user?.usrFirstName && user?.usrLastName
      ? `${user.usrFirstName} ${user.usrLastName}`
      : user?.usrUserName || "Employee";

  // Determine the user ID to fetch
  const targetUsrId = params.usrId || user?.usrID;

  // Determine the name to display in headers
  const headerDisplayName = authenticatedUserFullName;

  useEffect(() => {
    if (!targetUsrId) {
      setLoading(false);
      setError("Cannot determine a user ID to fetch DTR records.");
      return;
    }

    const fetchUserDTR = async () => {
      try {
        setLoading(true);
        console.log("[DTRDetails] Fetching DTR for targetUsrId:", targetUsrId);

        const userIdToFetch = Number.parseInt(targetUsrId);

        // Fetch DTR records
        const response = await ApiService.getDTRRecords(userIdToFetch);

        if (response.success && response.data) {
          const records = response.data;

          // --- 🛑 Step 1: Data Enrichment (Fetching School Names) ---
          // Collect unique acc_id (school ID) from DTR records
          const accIDs = [...new Set(records.map((r) => r.acc_id))].filter(
            (id) => id
          );
          const schoolMap = {};

          if (accIDs.length > 0) {
            // Fetch school names concurrently
            const schoolPromises = accIDs.map((id) => ApiService.getSchool(id));
            const schoolsResponses = await Promise.all(schoolPromises);

            schoolsResponses.forEach((res) => {
              if (res.success && res.data) {
                const school = res.data;
                // Map the ID (schoolid) to the name (accName or accName2)
                schoolMap[school.schoolid] =
                  school.accName2 || school.accName || "Unknown School";
              }
            });
          }
          // -----------------------------------------------------------

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
              name: authenticatedUserFullName,
              // 🛑 Step 2: Use the school map to get the school name
              school: schoolMap[record.acc_id] || "Unknown School",
              timeInAM: formatTime(record.tme_am_in),
              timeOutAM: formatTime(record.tme_am_out),
              timeInPM: formatTime(record.tme_pm_in),
              timeOutPM: formatTime(record.tme_pm_out),
              date: formatDate(record.tme_date),
            };
          });

          setDtrData(formattedData);
          setError(null);
        } else {
          throw new Error(response.message || "Failed to fetch DTR records");
        }
      } catch (err) {
        console.error("[DTRDetails] Fetch error:", err);
        setError(`Failed to load DTR data: ${err.message || "Unknown error"}`);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDTR();
  }, [targetUsrId, authenticatedUserFullName]);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#FF8C00" />
        <Text style={styles.loadingText}>
          Loading {headerDisplayName} DTR records...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>⚠️ {error}</Text>
      </View>
    );
  }

  if (dtrData.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyText}>
          No DTR records found for {headerDisplayName}.
        </Text>
      </View>
    );
  }

  // --- JSX DISPLAY UPDATED ---
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.headerTitle}>DTR Log for {headerDisplayName}</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tableScroll}
      >
        <View style={styles.table}>
          {/* Table Header - School column ADDED BACK */}
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.tableHeader, { width: 50 }]}>
              ID
            </Text>
            <Text
              style={[styles.tableCell, styles.tableHeader, { width: 150 }]}
            >
              Name
            </Text>
            <Text
              style={[styles.tableCell, styles.tableHeader, { width: 130 }]}
            >
              School
            </Text>
            <Text
              style={[styles.tableCell, styles.tableHeader, { width: 100 }]}
            >
              Time In (AM)
            </Text>
            <Text
              style={[styles.tableCell, styles.tableHeader, { width: 110 }]}
            >
              Time Out (AM)
            </Text>
            <Text
              style={[styles.tableCell, styles.tableHeader, { width: 100 }]}
            >
              Time In (PM)
            </Text>
            <Text
              style={[styles.tableCell, styles.tableHeader, { width: 110 }]}
            >
              Time Out (PM)
            </Text>
            <Text
              style={[styles.tableCell, styles.tableHeader, { width: 100 }]}
            >
              Date
            </Text>
          </View>

          {/* Table Rows - School cell ADDED BACK */}
          {dtrData.map((item, index) => (
            <View
              // 🛑 Alternative Fix: Use the index if the DB ID is causing issues,
              // but only if the list items won't be reordered, filtered, or deleted.
              key={index}
              style={[styles.tableRow, index % 2 !== 0 && styles.tableRowAlt]}
            >
              <Text style={[styles.tableCell, { width: 50 }]}>{item.id}</Text>
              <Text style={[styles.tableCell, { width: 150 }]}>
                {item.name}
              </Text>
              {/* 🛑 ADDED: School Data Cell */}
              <Text style={[styles.tableCell, { width: 130 }]}>
                {item.school}
              </Text>
              <Text style={[styles.tableCell, { width: 100 }]}>
                {item.timeInAM}
              </Text>
              <Text style={[styles.tableCell, { width: 110 }]}>
                {item.timeOutAM}
              </Text>
              <Text style={[styles.tableCell, { width: 100 }]}>
                {item.timeInPM}
              </Text>
              <Text style={[styles.tableCell, { width: 110 }]}>
                {item.timeOutPM}
              </Text>
              <Text style={[styles.tableCell, { width: 100 }]}>
                {item.date}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  // Note: minWidth for the table has been adjusted to accommodate the new column.
  container: {
    flex: 1,
    backgroundColor: "#fafafaff",
    padding: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  tableScroll: {
    borderRadius: 8,
    overflow: "hidden",
    marginTop: 5,
    elevation: 2, // Shadow for Android
    shadowColor: "#000", // Shadow for iOS
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  table: {
    borderColor: "#E5E7EB",
    borderRadius: 8,
    overflow: "hidden",
    minWidth: 850, // Adjusted for the extra 'School' column
  },
  tableHeader: {
    backgroundColor: "#FF8C00",
    color: "#FFFFFF",
    fontWeight: "600",
    paddingVertical: 12,
    paddingHorizontal: 8,
    textAlign: "center",
  },
  tableCell: {
    fontSize: 12,
    color: "#111827",
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRightWidth: 1,
    borderRightColor: "#E5E7EB",
    textAlign: "center",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
  },
  tableRowAlt: {
    backgroundColor: "#f5f5f5",
  },
  centerContainer: {
    flex: 1,
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

export default DTRLog;
