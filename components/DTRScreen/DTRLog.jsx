"use client";
import { useAuth } from "@/contexts/AuthContexts";
import { useTheme } from "@/contexts/ThemeContext";
import ApiService from "@/services/api";
import AttendanceFilter from "components/attendance-card";
import DateFilter from "components/date-range-filter";
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

const DTRLog = () => {
  const params = useLocalSearchParams();
  const { user } = useAuth();
  const [dtrData, setDtrData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [targetUserInfo, setTargetUserInfo] = useState(null);

  // Date picker states
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
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  // Click outside handler for web calendars
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

  // Date picker handlers
  const showFromDatePicker = () => setFromDatePickerVisibility(true);
  const hideFromDatePicker = () => setFromDatePickerVisibility(false);
  const handleFromDateConfirm = (date) => {
    setFilterFromDate(date);
    hideFromDatePicker();
  };
  const showToDatePicker = () => setToDatePickerVisibility(true);
  const hideToDatePicker = () => setToDatePickerVisibility(false);
  const handleToDateConfirm = (date) => {
    setFilterToDate(date);
    hideToDatePicker();
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

  // Parse time helper
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

  // Calculate hours function
  const calculateHours = (fromDate = null, toDate = null) => {
    if (!dtrData || dtrData.length === 0) {
      return { totalHours: "0", daysPresent: 0, daysAbsent: 0 };
    }

    let totalMinutes = 0;
    let daysWithData = new Set();
    let allUniqueDates = new Set();
    let fromDateObj = fromDate ? new Date(fromDate) : null;
    let toDateObj = toDate ? new Date(toDate) : null;

    if (fromDateObj) fromDateObj.setHours(0, 0, 0, 0);
    if (toDateObj) toDateObj.setHours(23, 59, 59, 999);

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
                if (duration < 0) duration += 24 * 60;
                dayMinutes = duration;
              }
            } else {
              if (hasAmIn && hasAmOut) {
                const amIn = parseTime(record.timeInAM);
                const amOut = parseTime(record.timeOutAM);
                if (amIn !== null && amOut !== null) {
                  let dur = amOut - amIn;
                  if (dur < 0) dur += 24 * 60;
                  dayMinutes += dur;
                }
              }
              if (hasPmIn && hasPmOut) {
                const pmIn = parseTime(record.timeInPM);
                const pmOut = parseTime(record.timeOutPM);
                if (pmIn !== null && pmOut !== null) {
                  let dur = pmOut - pmIn;
                  if (dur < 0) dur += 24 * 60;
                  dayMinutes += dur;
                }
              }
            }

            totalMinutes += dayMinutes;
            if (dayMinutes > 0) daysWithData.add(record.date);
          }
        } catch (e) {
          console.error("[DTRLog] Error parsing date:", record.date);
        }
      }
    });

    const daysPresent = daysWithData.size;
    const daysAbsent = Math.max(0, allUniqueDates.size - daysPresent);
    const totalHours = Math.round(totalMinutes / 60).toString();

    return { totalHours, daysPresent, daysAbsent };
  };

  const allTimeStats = calculateHours(appliedFromDate, appliedToDate);
  const { totalHours, daysPresent, daysAbsent } = allTimeStats;

  // Filter data based on applied dates
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
        return true;
      }
    }
    return true;
  });

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };
  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  // Fetch DTR data
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
        if (isNaN(userIdToFetch))
          throw new Error(`Invalid user ID: ${targetUsrId}`);

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

          const formattedData = records.map((record) => ({
            id: record.tme_id || "N/A",
            name: targetUserFullName,
            school: schoolName,
            timeInAM: formatTime(record.tme_am_in),
            timeOutAM: formatTime(record.tme_am_out),
            timeInPM: formatTime(record.tme_pm_in),
            timeOutPM: formatTime(record.tme_pm_out),
            date: formatDate(record.tme_date),
            rawAccId: record.acc_id,
          }));

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

  // Simple DonutChart fallback
  const DonutChart = ({ daysPresent, daysAbsent }) => {
    const total = daysPresent + daysAbsent;
    if (total === 0) {
      return (
        <View style={styles.chartContainer}>
          <Text style={styles.noDataText}>No data</Text>
        </View>
      );
    }
    const presentPercent = Math.round((daysPresent / total) * 100);
    return (
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          width: 80,
          height: 80,
        }}
      >
        <View
          style={{
            width: 70,
            height: 70,
            borderRadius: 35,
            borderWidth: 8,
            borderColor: "#EF4444",
            backgroundColor: "#FF8C00",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: "white",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 10, fontWeight: "600" }}>
              {presentPercent}%
            </Text>
          </View>
        </View>
      </View>
    );
  };

  // Loading state
  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={styles.loadingText}>Loading DTR records...</Text>
      </View>
    );
  }

  // Error state
  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>⚠️ {error}</Text>
        <Text style={styles.debugText}>User ID: {targetUsrId}</Text>
      </View>
    );
  }

  const displayName = targetUserInfo?.name || "Employee";

  // Empty state
  if (dtrData.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyText}>No DTR records found.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.cardsScrollContainer}
        contentContainerStyle={styles.cardsScrollContent}
      >
        <DateFilter
          filterFromDate={filterFromDate}
          setFilterFromDate={setFilterFromDate}
          filterToDate={filterToDate}
          setFilterToDate={setFilterToDate}
          showWebFromCalendar={showWebFromCalendar}
          setShowWebFromCalendar={setShowWebFromCalendar}
          showWebToCalendar={showWebToCalendar}
          setShowWebToCalendar={setShowWebToCalendar}
          webCalendarDate={webCalendarDate}
          setWebCalendarDate={setWebCalendarDate}
          isFromDatePickerVisible={isFromDatePickerVisible}
          isToDatePickerVisible={isToDatePickerVisible}
          showFromDatePicker={showFromDatePicker}
          showToDatePicker={showToDatePicker}
          hideFromDatePicker={hideFromDatePicker}
          hideToDatePicker={hideToDatePicker}
          handleFromDateConfirm={handleFromDateConfirm}
          handleToDateConfirm={handleToDateConfirm}
          handleClearFilters={handleClearFilters}
          handleSearchFilters={handleSearchFilters}
          formatDisplayDate={formatDisplayDate}
        />
        <AttendanceFilter
          daysPresent={daysPresent}
          daysAbsent={daysAbsent}
          totalHours={totalHours}
          appliedFromDate={appliedFromDate}
          appliedToDate={appliedToDate}
          DonutChart={DonutChart}
        />
      </ScrollView>

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
    container: { flex: 1, backgroundColor: "#FAFAFA", padding: 16 },
    centerContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 16,
    },
    loadingText: { marginTop: 12, fontSize: 14, color: "#666" },
    errorText: {
      fontSize: 14,
      color: "#EF4444",
      textAlign: "center",
      marginBottom: 8,
    },
    debugText: { fontSize: 12, color: "#999", textAlign: "center" },
    emptyText: { fontSize: 14, color: "#999" },
    cardsScrollContainer: { marginBottom: 7 },
    cardsScrollContent: { flexDirection: "row", gap: 5, paddingRight: 16 },
    chartContainer: { justifyContent: "flex-start", alignItems: "center" },
    noDataText: { fontSize: 14, color: "#999" },
    tableScroll: { marginBottom: 24 },
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
    tableRowAlt: { backgroundColor: "#F9FAFB" },
    tableCell: {
      paddingVertical: 12,
      paddingHorizontal: 8,
      fontSize: 12,
      color: theme.contentText,
      borderRightWidth: 1,
      borderRightColor: "#E5E7EB",
    },
    tableHeader: {
      backgroundColor: theme.cardHeader,
      color: theme.buttonText,
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
    paginationButtonDisabled: { backgroundColor: "#D1D5DB" },
    paginationButtonText: {
      color: theme.buttonText,
      fontSize: 12,
      fontWeight: "600",
    },
    pageInfo: { fontSize: 12, color: "#4B5563", fontWeight: "500" },
  });

export default DTRLog;
