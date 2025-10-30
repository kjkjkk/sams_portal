"use client";

import { config, database } from "@/services/appwrite";
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

const DTRStats = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [dtrData, setDtrData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDTRData = async () => {
      try {
        setLoading(true);

        console.log("[v0] Starting DTR data fetch...");
        console.log("[v0] Database ID:", config.databaseId);

        // Fetch all DTR records from tr_sams_card table
        const dtrRecords = await database.listDocuments(
          config.databaseId,
          config.collections.dtrSamsCard
        );
        console.log("[v0] DTR Records fetched:", dtrRecords.documents.length);
        console.log("[v0] First record sample:", dtrRecords.documents[0]);

        // Transform and enrich data with user and school information
        const enrichedData = await Promise.all(
          dtrRecords.documents.map(async (record) => {
            try {
              console.log(
                "[v0] Processing record with std_id:",
                record.std_id,
                "accID:",
                record.accID
              );

              let userName = "Unknown";
              let schoolName = "Unknown";

              try {
                const userResults = await database.listDocuments(
                  config.databaseId,
                  config.collections.users2,
                  [
                    {
                      attribute: "std_id",
                      value: record.std_id,
                      method: "equal",
                    },
                  ]
                );
                if (userResults.documents.length > 0) {
                  const userDoc = userResults.documents[0];
                  userName = `${userDoc.usrFirstName} ${userDoc.userLastName}`;
                  console.log("[v0] User found:", userName);
                } else {
                  console.log("[v0] No user found for std_id:", record.std_id);
                }
              } catch (userErr) {
                console.log("[v0] Error fetching user:", userErr.message);
              }

              try {
                const schoolResults = await database.listDocuments(
                  config.databaseId,
                  config.collections.schoolaccounts,
                  [{ attribute: "accID", value: record.accID, method: "equal" }]
                );
                if (schoolResults.documents.length > 0) {
                  const schoolDoc = schoolResults.documents[0];
                  schoolName = schoolDoc.accName2;
                  console.log("[v0] School found:", schoolName);
                } else {
                  console.log("[v0] No school found for accID:", record.accID);
                }
              } catch (schoolErr) {
                console.log("[v0] Error fetching school:", schoolErr.message);
              }

              // Helper functions for formatting
              const formatTime = (datetime) => {
                if (!datetime) return "N/A";
                const d = new Date(datetime);
                return d.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                });
              };

              const formatDate = (datetime) => {
                if (!datetime) return "N/A";
                const d = new Date(datetime);
                return d.toISOString().split("T")[0]; // "YYYY-MM-DD"
              };

              // Inside your map return
              return {
                id: record.std_id,
                name: userName,
                school: schoolName,
                timeInAM: formatTime(record.tme_am_in),
                timeOutAM: formatTime(record.tme_am_out),
                timeInPM: formatTime(record.tme_pm_in),
                timeOutPM: formatTime(record.tme_pm_out),
                date: formatDate(record.tme_date),
              };
            } catch (err) {
              console.log("[v0] Error enriching record:", err.message);
              // Return partial data if enrichment fails
              // Helper functions for formatting
              const formatTime = (datetime) => {
                if (!datetime) return "N/A";
                const d = new Date(datetime);
                return d.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                });
              };

              const formatDate = (datetime) => {
                if (!datetime) return "N/A";
                const d = new Date(datetime);
                return d.toISOString().split("T")[0]; // "YYYY-MM-DD"
              };

              // Inside your map return
              return {
                id: record.std_id,
                name: userName,
                school: schoolName,
                timeInAM: formatTime(record.tme_am_in),
                timeOutAM: formatTime(record.tme_am_out),
                timeInPM: formatTime(record.tme_pm_in),
                timeOutPM: formatTime(record.tme_pm_out),
                date: formatDate(record.tme_date),
              };
            }
          })
        );

        console.log("[v0] Enriched data:", enrichedData);
        setDtrData(enrichedData);
        setError(null);
      } catch (err) {
        console.log("[v0] Error fetching DTR data:", err.message);
        console.log("[v0] Full error:", err);
        setError(`Failed to load DTR data: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchDTRData();
  }, []);

  const totalPages = Math.ceil(dtrData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedData = dtrData.slice(startIndex, startIndex + rowsPerPage);

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#FF8C00" />
        <Text style={styles.loadingText}>Loading DTR data...</Text>
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

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
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
                  <View style={styles.legendItem}>
                    <View
                      style={[styles.legendDot, { backgroundColor: "#FBBF24" }]}
                    />
                    <Text style={styles.legendText}>
                      Total Break: <Text style={styles.legendValue}>12</Text>
                    </Text>
                  </View>
                </View>
                <View style={styles.cardDivider} />
                <Text style={styles.monthText}>
                  Total Hours of the Month:{" "}
                  <Text style={styles.monthValue}>322</Text>
                </Text>
              </View>
              {/* Pie Chart Placeholder */}
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
              {/* Pie Chart Placeholder */}
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
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tableScroll}
      >
        <View style={styles.table}>
          {/* Table Header */}
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.tableHeader, { width: 50 }]}>
              ID
            </Text>
            <Text
              style={[styles.tableCell, styles.tableHeader, { width: 120 }]}
            >
              Name
            </Text>
            <Text
              style={[styles.tableCell, styles.tableHeader, { width: 100 }]}
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
            <Text style={[styles.tableCell, styles.tableHeader, { width: 90 }]}>
              Date
            </Text>
          </View>

          {/* Table Rows */}
          {paginatedData.map((item, index) => (
            <View
              key={index}
              style={[styles.tableRow, index % 2 === 0 && styles.tableRowAlt]}
            >
              <Text style={[styles.tableCell, { width: 50 }]}>{item.id}</Text>
              <Text style={[styles.tableCell, { width: 120 }]}>
                {item.name}
              </Text>
              <Text style={[styles.tableCell, { width: 100 }]}>
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
              <Text style={[styles.tableCell, { width: 90 }]}>{item.date}</Text>
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

export default DTRStats;

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
    minWidth: width - 80,
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
    borderRightColor: "#E5E7EB", // Add this for vertical lines
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
