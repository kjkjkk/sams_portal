import { Ionicons } from "@expo/vector-icons";
import {
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";

const DateFilter = ({
  filterFromDate,
  setFilterFromDate,
  filterToDate,
  setFilterToDate,
  showWebFromCalendar,
  setShowWebFromCalendar,
  showWebToCalendar,
  setShowWebToCalendar,
  webCalendarDate,
  setWebCalendarDate,
  isFromDatePickerVisible,
  isToDatePickerVisible,
  showFromDatePicker,
  showToDatePicker,
  hideFromDatePicker,
  hideToDatePicker,
  handleFromDateConfirm,
  handleToDateConfirm,
  handleClearFilters,
  handleSearchFilters,
  formatDisplayDate,
}) => {
  const isWeb = Platform.OS === "web";

  return (
    <View style={styles.cardHorizontal}>
      <View style={styles.filterHeader}>
        <Text style={styles.filterTitle}>Filter by Date Range</Text>
      </View>

      {/* Remove the dynamic marginBottom - no longer needed */}
      <View style={styles.filterContent}>
        {/* FROM Date */}
        <View style={styles.filterInputGroup}>
          <Text style={styles.filterLabel}>From:</Text>
          <Pressable
            style={styles.datePickerButton}
            onPress={() => {
              if (isWeb) {
                setWebCalendarDate(filterFromDate || new Date());
                setShowWebFromCalendar(!showWebFromCalendar);
                setShowWebToCalendar(false);
              } else {
                showFromDatePicker();
              }
            }}
          >
            <Text style={styles.datePickerText}>
              {formatDisplayDate(filterFromDate)}
            </Text>
            <Ionicons name="calendar-outline" size={16} color="#6B7280" />
          </Pressable>
        </View>

        {/* TO Date */}
        <View style={styles.filterInputGroup}>
          <Text style={styles.filterLabel}>To:</Text>
          <Pressable
            style={styles.datePickerButton}
            onPress={() => {
              if (isWeb) {
                setWebCalendarDate(filterToDate || new Date());
                setShowWebToCalendar(!showWebToCalendar);
                setShowWebFromCalendar(false);
              } else {
                showToDatePicker();
              }
            }}
          >
            <Text style={styles.datePickerText}>
              {formatDisplayDate(filterToDate)}
            </Text>
            <Ionicons name="calendar-outline" size={16} color="#6B7280" />
          </Pressable>
        </View>
      </View>

      {/* Web Calendar Modal - Using RN Modal for proper overlay */}
      {isWeb && (
        <Modal
          visible={showWebFromCalendar || showWebToCalendar}
          transparent={true}
          animationType="fade"
          onRequestClose={() => {
            setShowWebFromCalendar(false);
            setShowWebToCalendar(false);
          }}
        >
          <View style={styles.modalOverlay}>
            <Pressable
              style={styles.modalBackdrop}
              onPress={() => {
                setShowWebFromCalendar(false);
                setShowWebToCalendar(false);
              }}
            />
            <View style={styles.modalContent}>
              <WebCalendarDropdown
                webCalendarDate={webCalendarDate}
                setWebCalendarDate={setWebCalendarDate}
                onSelectDate={(date) => {
                  if (showWebFromCalendar) {
                    setFilterFromDate(date);
                    setShowWebFromCalendar(false);
                  } else {
                    setFilterToDate(date);
                    setShowWebToCalendar(false);
                  }
                }}
                onClose={() => {
                  setShowWebFromCalendar(false);
                  setShowWebToCalendar(false);
                }}
                title={
                  showWebFromCalendar ? "Select From Date" : "Select To Date"
                }
              />
            </View>
          </View>
        </Modal>
      )}

      {/* Mobile Date Pickers */}
      {!isWeb && (
        <>
          <DateTimePickerModal
            isVisible={isFromDatePickerVisible}
            mode="date"
            onConfirm={handleFromDateConfirm}
            onCancel={hideFromDatePicker}
            date={filterFromDate || new Date()}
            display="inline"
          />
          <DateTimePickerModal
            isVisible={isToDatePickerVisible}
            mode="date"
            onConfirm={handleToDateConfirm}
            onCancel={hideToDatePicker}
            date={filterToDate || new Date()}
            display="inline"
          />
        </>
      )}

      {/* Buttons */}
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
  );
};

const WebCalendarDropdown = ({
  webCalendarDate,
  setWebCalendarDate,
  onSelectDate,
  onClose,
  title,
}) => {
  const year = webCalendarDate.getFullYear();
  const month = webCalendarDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  return (
    <View style={styles.webCalendarDropdown}>
      {/* Title & Close */}
      <View style={styles.calendarTitleRow}>
        <Text style={styles.calendarTitle}>{title}</Text>
        <Pressable onPress={onClose} style={styles.closeBtn}>
          <Ionicons name="close" size={20} color="#6B7280" />
        </Pressable>
      </View>

      <View style={styles.calendarHeader}>
        <Pressable
          onPress={() => setWebCalendarDate(new Date(year, month - 1, 1))}
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
          onPress={() => setWebCalendarDate(new Date(year, month + 1, 1))}
          style={styles.calendarNavBtn}
        >
          <Text style={styles.calendarNavText}>→</Text>
        </Pressable>
      </View>

      <View style={styles.calendarWeekDays}>
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <Text key={day} style={styles.calendarWeekDay}>
            {day}
          </Text>
        ))}
      </View>

      <View style={styles.calendarDaysGrid}>
        {Array.from({ length: firstDay }, (_, i) => (
          <View key={`empty-${i}`} style={styles.calendarDayCell} />
        ))}
        {Array.from({ length: daysInMonth }, (_, i) => (
          <Pressable
            key={i + 1}
            style={styles.calendarDayCell}
            onPress={() => onSelectDate(new Date(year, month, i + 1))}
          >
            <Text style={styles.calendarDayText}>{i + 1}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
    width: 350,
  },
  filterHeader: { marginBottom: 16 },
  filterTitle: { fontSize: 12, fontWeight: "600", color: "#1F2937" },
  filterContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    gap: 12,
  },
  filterInputGroup: { flex: 1 },
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
  datePickerText: { fontSize: 12, color: "#1F2937" },
  filterButtonContainer: { flexDirection: "row", gap: 5 },
  filterButton: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: 6,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  searchButton: { backgroundColor: "#FF8C00" },
  searchButtonText: { color: "#FFFFFF", fontSize: 11, fontWeight: "600" },
  clearButton: { backgroundColor: "#EF4444" },
  clearButtonText: { color: "#FFFFFF", fontSize: 11, fontWeight: "600" },

  // Modal Overlay - Centers the calendar
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalBackdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContent: {
    maxHeight: "80%",
  },

  // Calendar styles
  webCalendarDropdown: {
    minWidth: 300,
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
  },
  calendarTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  calendarTitle: { fontSize: 16, fontWeight: "700", color: "#1F2937" },
  closeBtn: { padding: 4 },
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
  calendarNavText: { fontSize: 18, fontWeight: "700", color: "#374151" },
  calendarMonthYear: { fontSize: 15, fontWeight: "600", color: "#1F2937" },
  calendarWeekDays: { flexDirection: "row", marginBottom: 8 },
  calendarWeekDay: {
    flex: 1,
    textAlign: "center",
    fontSize: 12,
    fontWeight: "600",
    color: "#9CA3AF",
  },
  calendarDaysGrid: { flexDirection: "row", flexWrap: "wrap", gap: 2 },
  calendarDayCell: {
    width: "13.5%",
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 6,
    margin: 1,
  },
  calendarDayText: { fontSize: 14, color: "#1F2937", fontWeight: "500" },
});

export default DateFilter;
