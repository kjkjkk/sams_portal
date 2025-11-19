"use client";
import { useAuth } from "@/contexts/AuthContexts";
import { useTheme } from "@/contexts/ThemeContext"; // Add this import
import ApiService from "@/services/api";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { PieChart } from "react-native-chart-kit";
import DateTimePickerModal from "react-native-modal-datetime-picker";

const DTRLog = () => {
  const params = useLocalSearchParams();
  const { user } = useAuth();
  const [dtrData, setDtrData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [targetUserInfo, setTargetUserInfo] = useState(null);

  // Date picker states - Updated for modal datetime picker
  const [filterFromDate, setFilterFromDate] = useState(null);
  const [filterToDate, setFilterToDate] = useState(null);
  const [appliedFromDate, setAppliedFromDate] = useState(null);
  const [appliedToDate, setAppliedToDate] = useState(null);
  const [isFromDatePickerVisible, setFromDatePickerVisibility] =
    useState(false);
  const [isToDatePickerVisible, setToDatePickerVisibility] = useState(false);

  const [showWebFromCalendar, setShowWebFromCalendar] = useState(false);
  const [showWebToCalendar, setShowWebToCalendar] = useState(false);
  const [webCalendarDate, setWebCalendarDate] = useState(new Date());

  const targetUsrId = params.usrId || params.empId || user?.usrID;
  const isWeb = Platform.OS === "web";

  const { theme } = useTheme(); // Get theme from context
  // Create dynamic styles based on theme
  const styles = useMemo(() => createStyles(theme), [theme]);

  useEffect(() => {
    if (Platform.OS === "web") {
      const handleClickOutside = (event) => {
        if (!event.target.closest(".calendar-container")) {
          setShowWebFromCalendar(false);
          setShowWebToCalendar(false);
        }
      };

      if (showWebFromCalendar || showWebToCalendar) {
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
          document.removeEventListener("mousedown", handleClickOutside);
      }
    }
  }, [showWebFromCalendar, showWebToCalendar]);

  // Modal DateTime Picker handlers
  const showFromDatePicker = () => {
    setFromDatePickerVisibility(true);
  };

  const hideFromDatePicker = () => {
    setFromDatePickerVisibility(false);
  };

  const handleFromDateConfirm = (date) => {
    setFilterFromDate(date);
    hideFromDatePicker();
  };

  const showToDatePicker = () => {
    setToDatePickerVisibility(true);
  };

  const hideToDatePicker = () => {
    setToDatePickerVisibility(false);
  };

  const handleToDateConfirm = (date) => {
    setFilterToDate(date);
    hideToDatePicker();
  };

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

  const calculateHours = (fromDate = null, toDate = null) => {
    if (!dtrData || dtrData.length === 0) {
      return {
        totalHours: "0",
        daysPresent: 0,
        daysAbsent: 0,
      };
    }

    let totalMinutes = 0;
    let daysWithData = new Set();
    let allUniqueDates = new Set();

    let fromDateObj = null;
    let toDateObj = null;

    if (fromDate) {
      fromDateObj = new Date(fromDate);
      fromDateObj.setHours(0, 0, 0, 0);
    }

    if (toDate) {
      toDateObj = new Date(toDate);
      toDateObj.setHours(23, 59, 59, 999);
    }

    dtrData.forEach((record) => {
      if (record.date && record.date !== "N/A") {
        try {
          const recordDate = new Date(record.date);
          recordDate.setHours(0, 0, 0, 0);

          const isInRange =
            (!fromDateObj || recordDate >= fromDateObj) &&
            (!toDateObj || recordDate <= toDateObj);

          if (isInRange) {
            allUniqueDates.add(record.date);

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
              daysWithData.add(record.date);
            }
          }
        } catch (e) {
          console.error("[DTRLog] Error parsing date:", record.date);
        }
      }
    });

    const daysPresent = daysWithData.size;
    const totalDaysInRange = allUniqueDates.size;
    const daysAbsent = Math.max(0, totalDaysInRange - daysPresent);
    const totalHours = Math.round(totalMinutes / 60).toString();

    return {
      totalHours,
      daysPresent,
      daysAbsent,
    };
  };

  const allTimeStats = calculateHours(
    appliedFromDate || null,
    appliedToDate || null
  );
  const { totalHours, daysPresent, daysAbsent } = allTimeStats;

  const filteredData = dtrData.filter((record) => {
    if (!appliedFromDate && !appliedToDate) return true;

    if (record.date && record.date !== "N/A") {
      try {
        const recordDate = new Date(record.date);
        recordDate.setHours(0, 0, 0, 0);

        if (appliedFromDate) {
          const fromDate = new Date(appliedFromDate);
          fromDate.setHours(0, 0, 0, 0);
          if (recordDate < fromDate) return false;
        }

        if (appliedToDate) {
          const toDate = new Date(appliedToDate);
          toDate.setHours(23, 59, 59, 999);
          if (recordDate > toDate) return false;
        }

        return true;
      } catch (e) {
        console.error("[DTRLog] Error filtering date:", record.date);
        return true;
      }
    }
    return true;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

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

  const handleSearchFilters = () => {
    setAppliedFromDate(filterFromDate);
    setAppliedToDate(filterToDate);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilterFromDate(null);
    setFilterToDate(null);
    setAppliedFromDate(null);
    setAppliedToDate(null);
    setCurrentPage(1);
  };

  const formatDisplayDate = (date) => {
    if (!date) return "Select Date";
    return new Date(date).toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });
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
        <ActivityIndicator size="large" color={theme.primary} />
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

  const DonutChart = ({ daysPresent, daysAbsent }) => {
    const total = daysPresent + daysAbsent;

    if (total === 0) {
      return (
        <View style={styles.chartContainer}>
          <Text style={styles.noDataText}>No data</Text>
        </View>
      );
    }

    const data = [
      {
        name: "Days Present",
        hours: daysPresent || 0.1,
        color: "#EF4444",
        legendFontColor: "#1F2937",
        legendFontSize: 14,
      },
      {
        name: "Days Absent",
        hours: daysAbsent || 0.1,
        color: "#FF8C00",
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
            marginLeft: -5,
            backgroundColor: "white",
          }}
        />
      </View>
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.cardsScrollContainer}
        contentContainerStyle={styles.cardsScrollContent}
      >
        {/* Filter by Date Range Card */}
        <View style={styles.cardHorizontal}>
          <View style={styles.filterHeader}>
            <Text style={styles.filterTitle}>Filter by Date Range</Text>
          </View>
          <View
            style={[
              styles.filterContent,
              (showWebFromCalendar || showWebToCalendar) && {
                marginBottom: 380,
              },
            ]}
          >
            <View style={styles.filterInputGroup}>
              <Text style={styles.filterLabel}>From:</Text>
              {isWeb ? (
                <View
                  style={{
                    position: "relative",
                    zIndex: showWebFromCalendar ? 100 : 1,
                  }}
                  className="calendar-container"
                >
                  <Pressable
                    style={styles.datePickerButton}
                    onPress={() => {
                      setWebCalendarDate(filterFromDate || new Date());
                      setShowWebFromCalendar(!showWebFromCalendar);
                      setShowWebToCalendar(false);
                    }}
                  >
                    <Text style={styles.datePickerText}>
                      {formatDisplayDate(filterFromDate)}
                    </Text>
                    <Ionicons
                      name="calendar-outline"
                      size={16}
                      color="#6B7280"
                    />
                  </Pressable>

                  {showWebFromCalendar && (
                    <View style={styles.webCalendarDropdown}>
                      <View style={styles.calendarHeader}>
                        <Pressable
                          onPress={() =>
                            setWebCalendarDate(
                              new Date(
                                webCalendarDate.getFullYear(),
                                webCalendarDate.getMonth() - 1,
                                1
                              )
                            )
                          }
                          style={styles.calendarNavBtn}
                        >
                          <Text style={styles.calendarNavText}>←</Text>
                        </Pressable>
                        <Text style={styles.calendarMonthYear}>
                          {webCalendarDate.toLocaleString("default", {
                            month: "long",
                            year: "numeric",
                          })}
                        </Text>
                        <Pressable
                          onPress={() =>
                            setWebCalendarDate(
                              new Date(
                                webCalendarDate.getFullYear(),
                                webCalendarDate.getMonth() + 1,
                                1
                              )
                            )
                          }
                          style={styles.calendarNavBtn}
                        >
                          <Text style={styles.calendarNavText}>→</Text>
                        </Pressable>
                      </View>

                      <View style={styles.calendarWeekDays}>
                        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                          (day) => (
                            <Text key={day} style={styles.calendarWeekDay}>
                              {day}
                            </Text>
                          )
                        )}
                      </View>

                      <View style={styles.calendarDaysGrid}>
                        {(() => {
                          const year = webCalendarDate.getFullYear();
                          const month = webCalendarDate.getMonth();
                          const firstDay = new Date(year, month, 1).getDay();
                          const daysInMonth = new Date(
                            year,
                            month + 1,
                            0
                          ).getDate();
                          const days = [];

                          for (let i = 0; i < firstDay; i++) {
                            days.push(
                              <View
                                key={`empty-${i}`}
                                style={styles.calendarDayCell}
                              />
                            );
                          }

                          for (let day = 1; day <= daysInMonth; day++) {
                            const currentDay = day;
                            days.push(
                              <Pressable
                                key={day}
                                style={styles.calendarDayCell}
                                onPress={() => {
                                  const selected = new Date(
                                    year,
                                    month,
                                    currentDay
                                  );
                                  setFilterFromDate(selected);
                                  setShowWebFromCalendar(false);
                                }}
                              >
                                <Text style={styles.calendarDayText}>
                                  {day}
                                </Text>
                              </Pressable>
                            );
                          }

                          return days;
                        })()}
                      </View>
                    </View>
                  )}
                </View>
              ) : (
                <Pressable
                  style={styles.datePickerButton}
                  onPress={showFromDatePicker}
                >
                  <Text style={styles.datePickerText}>
                    {formatDisplayDate(filterFromDate)}
                  </Text>
                  <Ionicons name="calendar-outline" size={16} color="#6B7280" />
                </Pressable>
              )}
            </View>

            <View style={styles.filterInputGroup}>
              <Text style={styles.filterLabel}>To:</Text>
              {isWeb ? (
                <View
                  style={{
                    position: "relative",
                    zIndex: showWebToCalendar ? 100 : 1,
                  }}
                  className="calendar-container"
                >
                  <Pressable
                    style={styles.datePickerButton}
                    onPress={() => {
                      setWebCalendarDate(filterToDate || new Date());
                      setShowWebToCalendar(!showWebToCalendar);
                      setShowWebFromCalendar(false);
                    }}
                  >
                    <Text style={styles.datePickerText}>
                      {formatDisplayDate(filterToDate)}
                    </Text>
                    <Ionicons
                      name="calendar-outline"
                      size={16}
                      color="#6B7280"
                    />
                  </Pressable>

                  {showWebToCalendar && (
                    <View style={styles.webCalendarDropdown}>
                      <View style={styles.calendarHeader}>
                        <Pressable
                          onPress={() =>
                            setWebCalendarDate(
                              new Date(
                                webCalendarDate.getFullYear(),
                                webCalendarDate.getMonth() - 1,
                                1
                              )
                            )
                          }
                          style={styles.calendarNavBtn}
                        >
                          <Text style={styles.calendarNavText}>←</Text>
                        </Pressable>
                        <Text style={styles.calendarMonthYear}>
                          {webCalendarDate.toLocaleString("default", {
                            month: "long",
                            year: "numeric",
                          })}
                        </Text>
                        <Pressable
                          onPress={() =>
                            setWebCalendarDate(
                              new Date(
                                webCalendarDate.getFullYear(),
                                webCalendarDate.getMonth() + 1,
                                1
                              )
                            )
                          }
                          style={styles.calendarNavBtn}
                        >
                          <Text style={styles.calendarNavText}>→</Text>
                        </Pressable>
                      </View>

                      <View style={styles.calendarWeekDays}>
                        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                          (day) => (
                            <Text key={day} style={styles.calendarWeekDay}>
                              {day}
                            </Text>
                          )
                        )}
                      </View>

                      <View style={styles.calendarDaysGrid}>
                        {(() => {
                          const year = webCalendarDate.getFullYear();
                          const month = webCalendarDate.getMonth();
                          const firstDay = new Date(year, month, 1).getDay();
                          const daysInMonth = new Date(
                            year,
                            month + 1,
                            0
                          ).getDate();
                          const days = [];

                          for (let i = 0; i < firstDay; i++) {
                            days.push(
                              <View
                                key={`empty-${i}`}
                                style={styles.calendarDayCell}
                              />
                            );
                          }

                          for (let day = 1; day <= daysInMonth; day++) {
                            const currentDay = day;
                            days.push(
                              <Pressable
                                key={day}
                                style={styles.calendarDayCell}
                                onPress={() => {
                                  const selected = new Date(
                                    year,
                                    month,
                                    currentDay
                                  );
                                  setFilterToDate(selected);
                                  setShowWebToCalendar(false);
                                }}
                              >
                                <Text style={styles.calendarDayText}>
                                  {day}
                                </Text>
                              </Pressable>
                            );
                          }

                          return days;
                        })()}
                      </View>
                    </View>
                  )}
                </View>
              ) : (
                <Pressable
                  style={styles.datePickerButton}
                  onPress={showToDatePicker}
                >
                  <Text style={styles.datePickerText}>
                    {formatDisplayDate(filterToDate)}
                  </Text>
                  <Ionicons name="calendar-outline" size={16} color="#6B7280" />
                </Pressable>
              )}
            </View>
          </View>

          {/* Modal DateTime Pickers for Mobile only */}
          {!isWeb && (
            <>
              <DateTimePickerModal
                isVisible={isFromDatePickerVisible}
                mode="date"
                onConfirm={handleFromDateConfirm}
                onCancel={hideFromDatePicker}
                date={filterFromDate || new Date()}
                display="spinner"
              />
              <DateTimePickerModal
                isVisible={isToDatePickerVisible}
                mode="date"
                onConfirm={handleToDateConfirm}
                onCancel={hideToDatePicker}
                date={filterToDate || new Date()}
                display="spinner"
              />
            </>
          )}

          <View style={styles.filterButtonContainer}>
            <Pressable
              style={[styles.filterButton, styles.clearButton]}
              onPress={handleClearFilters}
            >
              <Ionicons
                name="close-circle"
                size={14}
                color="#FFFFFF"
                style={{ marginRight: 6 }}
              />
              <Text style={styles.clearButtonText}>Clear Date</Text>
            </Pressable>
            <Pressable
              style={[styles.filterButton, styles.searchButton]}
              onPress={handleSearchFilters}
            >
              <Ionicons
                name="search"
                size={14}
                color="#FFFFFF"
                style={{ marginRight: 6 }}
              />
              <Text style={styles.searchButtonText}>Search</Text>
            </Pressable>
          </View>
        </View>

        {/* Attendance Summary Card */}
        <View style={styles.cardHorizontal}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Attendance Summary</Text>
          </View>
          <View style={styles.cardContent}>
            {/* Left side - Legend */}
            <View style={styles.legendContainer}>
              <View style={styles.legendItem}>
                <View
                  style={[styles.legendDot, { backgroundColor: "#EF4444" }]}
                />
                <View>
                  <Text style={styles.legendLabel}>
                    {daysPresent} Days Present
                  </Text>
                </View>
              </View>

              <View style={styles.legendItem}>
                <View
                  style={[styles.legendDot, { backgroundColor: "#FF8C00" }]}
                />
                <View>
                  <Text style={styles.legendLabel}>
                    {daysAbsent} Days Absent
                  </Text>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.totalSection}>
                <Text style={styles.totalLabel}>
                  Total Hours{" "}
                  {appliedFromDate || appliedToDate
                    ? "in Range"
                    : "of the Month"}
                  : {totalHours}
                </Text>
              </View>
            </View>

            {/* Right side - Chart */}
            <DonutChart daysPresent={daysPresent} daysAbsent={daysAbsent} />
          </View>
        </View>
      </ScrollView>
      {/* Header */}
      <View style={{ marginBottom: 5 }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={{ color: "#FF7700", fontSize: 18 }}>▶</Text>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "600",
              color: "#1f2937",
              marginLeft: 8,
            }}
          >
            {displayName}'s Log
          </Text>
        </View>
      </View>
      {/* Table Section */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={[styles.tableScroll, { marginTop: 8 }]}
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
              style={[styles.tableCell, styles.tableHeader, { width: 120 }]}
            >
              Time In (AM)
            </Text>
            <Text
              style={[styles.tableCell, styles.tableHeader, { width: 120 }]}
            >
              Time Out (AM)
            </Text>
            <Text
              style={[styles.tableCell, styles.tableHeader, { width: 120 }]}
            >
              Time In (PM)
            </Text>
            <Text
              style={[styles.tableCell, styles.tableHeader, { width: 120 }]}
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
              <Text style={[styles.tableCell, { width: 120 }]}>
                {item.timeInAM}
              </Text>
              <Text style={[styles.tableCell, { width: 120 }]}>
                {item.timeOutAM}
              </Text>
              <Text style={[styles.tableCell, { width: 120 }]}>
                {item.timeInPM}
              </Text>
              <Text style={[styles.tableCell, { width: 120 }]}>
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

const createStyles = (theme) =>
  StyleSheet.create({
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
    cardsScrollContainer: {
      marginBottom: 7,
    },
    cardsScrollContent: {
      flexDirection: "row",
      gap: 5,
      paddingRight: 16,
    },
    cardHorizontal: {
      backgroundColor: "#FFFFFF",
      borderRadius: 16,
      padding: 10,
      marginBottom: 24,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
      minWidth: 300,
      width: 300,
    },
    filterHeader: {
      marginBottom: 16,
    },
    filterTitle: {
      fontSize: 14,
      fontWeight: "600",
      color: "#1F2937",
    },
    filterContent: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 12,
      gap: 12,
      position: "relative",
    },
    filterInputGroup: {
      flex: 1,
      position: "relative",
      zIndex: 10,
    },
    filterLabel: {
      fontSize: 11,
      color: "#6B7280",
      marginBottom: 6,
      fontWeight: "500",
    },
    datePickerButton: {
      borderWidth: 1,
      borderColor: "#E5E7EB",
      borderRadius: 6,
      paddingHorizontal: 12,
      paddingVertical: 8,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: "#FFFFFF",
    },
    datePickerText: {
      fontSize: 12,
      color: "#1F2937",
    },
    filterButtonContainer: {
      flexDirection: "row",
      gap: 5,
    },
    filterButton: {
      flex: 1,
      paddingVertical: 7,
      borderRadius: 6,
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "center",
    },
    searchButton: {
      backgroundColor: "#FF8C00",
    },
    searchButtonText: {
      color: "#FFFFFF",
      fontSize: 11,
      fontWeight: "600",
    },
    clearButton: {
      backgroundColor: "#EF4444",
    },
    clearButtonText: {
      color: "#FFFFFF",
      fontSize: 11,
      fontWeight: "600",
    },
    cardHeader: {
      marginBottom: 12,
    },
    cardTitle: {
      fontSize: 14,
      fontWeight: "600",
      color: "#1F2937",
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
      color: theme.contentText, // Dynamic theme color
      borderRightWidth: 1,
      borderRightColor: "#E5E7EB",
    },
    tableHeader: {
      backgroundColor: theme.cardHeader, // Dynamic theme color
      color: theme.buttonText, // Dynamic theme color
      fontWeight: "600",
      fontSize: 13,
    },
    webCalendarDropdown: {
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      minWidth: 280,
      maxWidth: 320,
      backgroundColor: "#FFFFFF",
      borderRadius: 12,
      borderWidth: 1,
      borderColor: "#E5E7EB",
      padding: 16,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.25,
      shadowRadius: 16,
      elevation: 10,
      zIndex: 9999,
    },
    calendarHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
      paddingBottom: 12,
      borderBottomWidth: 1,
      borderBottomColor: "#F3F4F6",
    },
    calendarNavBtn: {
      padding: 8,
      borderRadius: 6,
      backgroundColor: "#F9FAFB",
      width: 36,
      height: 36,
      justifyContent: "center",
      alignItems: "center",
    },
    calendarNavText: {
      fontSize: 18,
      fontWeight: "700",
      color: "#374151",
    },
    calendarMonthYear: {
      fontSize: 15,
      fontWeight: "600",
      color: "#1F2937",
    },
    calendarWeekDays: {
      flexDirection: "row",
      marginBottom: 8,
      paddingBottom: 8,
    },
    calendarWeekDay: {
      flex: 1,
      textAlign: "center",
      fontSize: 12,
      fontWeight: "600",
      color: "#9CA3AF",
    },
    calendarDaysGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 2,
    },
    calendarDayCell: {
      width: "13.5%",
      aspectRatio: 1,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 6,
      margin: 1,
    },
    calendarDayText: {
      fontSize: 14,
      color: "#1F2937",
      fontWeight: "500",
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
      color: theme.buttonText, // Dynamic theme color
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
