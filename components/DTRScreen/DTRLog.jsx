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
import { PieChart } from "react-native-chart-kit";

const DTRLog = () => {
  const params = useLocalSearchParams();
  const { user } = useAuth();
  const [dtrData, setDtrData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [targetUserInfo, setTargetUserInfo] = useState(null);

  const targetUsrId = params.usrId || params.empId || user?.usrID;

  const parseTime = (timeStr) => {
    if (!timeStr || timeStr === "N/A") return null;
    try {
      const [hours, minutes, seconds] = timeStr.split(":");
      const totalMinutes =
        Number.parseInt(hours) * 60 +
        Number.parseInt(minutes) +
        Number.parseInt(seconds || 0) / 60;
      return totalMinutes;
    } catch {
      return null;
    }
  };

  const calculateHours = (filterByMonth = false) => {
    if (!dtrData || dtrData.length === 0) {
      return {
        totalHours: "0",
        overtimeHours: "0",
        regularHours: "0",
        daysWorked: 0,
      };
    }

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    let totalMinutes = 0;
    let overtimeMinutes = 0;
    let daysCount = 0;
    const REGULAR_HOURS_PER_DAY = 8;
    const REGULAR_MINUTES_PER_DAY = REGULAR_HOURS_PER_DAY * 60;

    dtrData.forEach((record) => {
      if (filterByMonth && record.date && record.date !== "N/A") {
        try {
          const recordDate = new Date(record.date);
          const recordMonth = recordDate.getMonth();
          const recordYear = recordDate.getFullYear();

          if (recordMonth !== currentMonth || recordYear !== currentYear) {
            return;
          }
        } catch (e) {
          console.error("[DTRLog] Error parsing date:", record.date);
          return;
        }
      }

      let dayMinutes = 0;

      const hasAmIn = record.timeInAM && record.timeInAM !== "N/A";
      const hasAmOut = record.timeOutAM && record.timeOutAM !== "N/A";
      const hasPmIn = record.timeInPM && record.timeInPM !== "N/A";
      const hasPmOut = record.timeOutPM && record.timeOutPM !== "N/A";

      if (hasAmIn && hasPmOut) {
        const dayInMinutes = parseTime(record.timeInAM);
        const dayOutMinutes = parseTime(record.timeOutPM);

        if (dayInMinutes !== null && dayOutMinutes !== null) {
          let duration = dayOutMinutes - dayInMinutes;
          if (duration < 0) {
            duration += 24 * 60;
          }
          dayMinutes = duration;
        }
      } else {
        if (hasAmIn && hasAmOut) {
          const amInMinutes = parseTime(record.timeInAM);
          const amOutMinutes = parseTime(record.timeOutAM);

          if (amInMinutes !== null && amOutMinutes !== null) {
            let amDuration = amOutMinutes - amInMinutes;
            if (amDuration < 0) {
              amDuration += 24 * 60;
            }
            dayMinutes += amDuration;
          }
        }

        if (hasPmIn && hasPmOut) {
          const pmInMinutes = parseTime(record.timeInPM);
          const pmOutMinutes = parseTime(record.timeOutPM);

          if (pmInMinutes !== null && pmOutMinutes !== null) {
            let pmDuration = pmOutMinutes - pmInMinutes;
            if (pmDuration < 0) {
              pmDuration += 24 * 60;
            }
            dayMinutes += pmDuration;
          }
        }
      }

      totalMinutes += dayMinutes;

      if (dayMinutes > 0) {
        daysCount++;
      }

      if (dayMinutes > REGULAR_MINUTES_PER_DAY) {
        overtimeMinutes += dayMinutes - REGULAR_MINUTES_PER_DAY;
      }
    });

    const totalHours = Math.round(totalMinutes / 60).toString();
    const overtimeHours = Math.round(overtimeMinutes / 60).toString();
    const regularMinutes = totalMinutes - overtimeMinutes;
    const regularHours = Math.round(regularMinutes / 60).toString();

    return {
      totalHours,
      overtimeHours,
      regularHours,
      daysWorked: filterByMonth ? daysCount : dtrData.length,
    };
  };

  const allTimeStats = calculateHours(false);
  const { totalHours, overtimeHours, regularHours } = allTimeStats;

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
        const userIdToFetch = Number.parseInt(targetUsrId, 10);

        if (isNaN(userIdToFetch)) {
          throw new Error(`Invalid user ID: ${targetUsrId}`);
        }

        const response = await ApiService.getDTRRecords(userIdToFetch);

        if (response.success && response.data && response.data.length > 0) {
          const records = response.data;
          const firstRecord = records[0];
          const targetUserFullName = firstRecord.emp_name || "Unknown User";
          const targetUserAccId = firstRecord.acc_id;

          let schoolName = "Unknown School";
          if (targetUserAccId) {
            try {
              const schoolResponse = await ApiService.getSchool(
                targetUserAccId
              );
              if (schoolResponse.success && schoolResponse.data) {
                schoolName = schoolResponse.data.accName || "Unknown School";
              }
            } catch (schoolError) {
              console.error("[DTRLog] Error fetching school:", schoolError);
            }
          }

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

          setDtrData(formattedData);
          setError(null);
        } else {
          throw new Error(response.message || "No DTR records found");
        }
      } catch (err) {
        console.error("[DTRLog] Error:", err);
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

  const displayName = targetUserInfo?.name || "Employee";

  if (dtrData.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyText}>No DTR records found.</Text>
      </View>
    );
  }

  // Donut chart component
  const DonutChart = ({ regular, overtime }) => {
    const regHours = Number.parseFloat(regular);
    const overtimeHrs = Number.parseFloat(overtime);
    const total = regHours + overtimeHrs;

    if (total === 0) {
      return (
        <View style={styles.chartContainer}>
          <Text style={styles.noDataText}>No data</Text>
        </View>
      );
    }

    const data = [
      {
        name: "Regular Hours",
        hours: regHours,
        color: "#EF4444",
        legendFontColor: "#1F2937",
        legendFontSize: 14,
      },
      {
        name: "Overtime",
        hours: overtimeHrs,
        color: "#FF8C00",
        legendFontColor: "#1F2937",
        legendFontSize: 14,
      },
      {
        name: "Total Break",
        hours: 0.1,
        color: "#FFEB3B",
        legendFontColor: "#1F2937",
        legendFontSize: 14,
      },
    ];

    return (
      <View style={{ alignItems: "center", justifyContent: "center" }}>
        <PieChart
          data={data}
          width={90}
          height={90}
          paddingLeft="20"
          chartConfig={{
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          accessor="hours"
          backgroundColor="transparent"
          hasLegend={false}
        />
        <View
          style={{
            position: "absolute",
            width: 50,
            height: 50,
            borderRadius: 35,
            // paddingLeft: 20,
            marginLeft: -5,
            backgroundColor: "white", // or match your screen background
          }}
        />
      </View>
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={{ marginBottom: 16 }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={{ color: "#FF7700", fontSize: 18 }}>▶</Text>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "600",
              color: "#1f2937",
              marginLeft: 8,
              fontWeight: "600",
            }}
          >
            {displayName}'s Log
          </Text>
        </View>
      </View>

      {/* Card Section */}
      <View style={styles.card}>
        <View style={styles.cardContent}>
          {/* Left side - Legend */}
          <View style={styles.legendContainer}>
            <View style={styles.legendItem}>
              <View
                style={[styles.legendDot, { backgroundColor: "#EF4444" }]}
              />
              <View>
                {/* <Text style={styles.legendNumber}></Text> */}
                <Text style={styles.legendLabel}>
                  {regularHours} Regular Hour
                </Text>
              </View>
            </View>

            <View style={styles.legendItem}>
              <View
                style={[styles.legendDot, { backgroundColor: "#FF8C00" }]}
              />
              <View>
                {/* <Text style={styles.legendNumber}></Text> */}
                <Text style={styles.legendLabel}>{overtimeHours} Overtime</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.totalSection}>
              <Text style={styles.totalLabel}>
                Total Hours of the Month: {totalHours}
              </Text>
            </View>
          </View>

          {/* Right side - Chart */}
          <DonutChart regular={regularHours} overtime={overtimeHours} />
        </View>
      </View>

      {/* Table Section */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tableScroll}
      >
        <View style={styles.table}>
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

      {/* Pagination */}
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
    backgroundColor: "#FAFAFA",
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
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  legendContainer: {
    flex: 0,
    minWidth: 180,
    paddingRight: 20,
    justifyContent: "center",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  legendDot: {
    width: 14,
    height: 14,
    borderRadius: 2,
    marginRight: 8,
    marginTop: 2,
  },
  legendNumber: {
    fontSize: 14,
    color: "#1F2937",
    fontWeight: "600",
  },
  legendLabel: {
    fontSize: 11,
    color: "#6B7280",
    lineHeight: 14,
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 12,
  },
  totalSection: {
    marginTop: 4,
  },
  totalLabel: {
    fontSize: 11,
    color: "#6B7280",
    fontWeight: "400",
    marginBottom: 6,
    lineHeight: 14,
  },
  totalValue: {
    fontSize: 28,
    color: "#3B82F6",
    fontWeight: "700",
  },
  chartContainer: {
    justifyContent: "flex-start",
    alignItems: "center",
  },
  noDataText: {
    fontSize: 14,
    color: "#999",
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
