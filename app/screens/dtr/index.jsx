import DTRTable from "@/components/DTRScreen/DTRTable";
import BottomNavigation from "@/components/layout/bottom-navigation";
import Header from "@/components/layout/header";
import dtrStyles from "@/styles/appScreenStyles/dtrStyles";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useState } from "react";
import {
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";

const DTRScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();

  const [searchText, setSearchText] = useState("");
  const [selectedUserType, setSelectedUserType] = useState(null);

  // Date filter states
  const [filterFromDate, setFilterFromDate] = useState(null);
  const [filterToDate, setFilterToDate] = useState(null);
  const [isFromDatePickerVisible, setFromDatePickerVisibility] =
    useState(false);
  const [isToDatePickerVisible, setToDatePickerVisibility] = useState(false);
  const [showWebFromCalendar, setShowWebFromCalendar] = useState(false);
  const [showWebToCalendar, setShowWebToCalendar] = useState(false);
  const [webCalendarDate, setWebCalendarDate] = useState(new Date());

  const isWeb = Platform.OS === "web";

  const userTypes = [
    { id: null, label: "All" },
    { id: 2, label: "Admin" },
    { id: 4, label: "Student" },
    { id: 3, label: "Faculty" },
    { id: 5, label: "Employee" },
    { id: 6, label: "Program Head" },
    { id: 7, label: "SA" },
  ];

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

  const handleClearFilters = () => {
    setFilterFromDate(null);
    setFilterToDate(null);
  };

  const formatDisplayDate = (date) => {
    if (!date) return "Select Date";
    return new Date(date).toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });
  };

  return (
    <SafeAreaView style={dtrStyles.container}>
      <ScrollView
        style={dtrStyles.scrollView}
        contentContainerStyle={dtrStyles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        <Header />

        {/* DTR Title Section */}
        <View style={dtrStyles.dtrHeaderContainer}>
          <Ionicons name="time" size={24} color="#000" />
          <Text style={dtrStyles.dtrTitle}>Daily Time Record</Text>
          <View style={dtrStyles.divider} />
        </View>

        {/* Combined Filters Container */}
        <View style={styles.filtersWrapper}>
          {/* User Type & Search Combined Card */}
          <View style={styles.userTypeSearchCard}>
            {/* User Type Filter */}
            <View style={styles.userTypeSection}>
              <Text style={styles.sectionTitle}>User Type</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.filterButtonsContainer}>
                  {userTypes.map((type) => (
                    <TouchableOpacity
                      key={type.id ?? "all"}
                      style={[
                        styles.filterChip,
                        selectedUserType === type.id && styles.filterChipActive,
                      ]}
                      onPress={() => setSelectedUserType(type.id)}
                    >
                      {selectedUserType === type.id && (
                        <Ionicons
                          name="checkmark-circle"
                          size={16}
                          color="#F97316"
                          style={{ marginRight: 4 }}
                        />
                      )}
                      <Text
                        style={[
                          styles.filterChipText,
                          selectedUserType === type.id &&
                            styles.filterChipTextActive,
                        ]}
                      >
                        {type.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>

            {/* Search Bar */}
            {/* <View style={styles.searchSection}>
              <Text style={styles.sectionTitle}>Search</Text>
              <View style={styles.searchInputContainer}>
                <Ionicons
                  name="search"
                  size={20}
                  color="#999"
                  style={{ marginRight: 8 }}
                />
                <TextInput
                  style={styles.searchInputField}
                  placeholder="Search by name, school, or ID..."
                  placeholderTextColor="#999"
                  value={searchText}
                  onChangeText={setSearchText}
                />
                {searchText.length > 0 && (
                  <TouchableOpacity onPress={() => setSearchText("")}>
                    <Ionicons name="close-circle" size={20} color="#999" />
                  </TouchableOpacity>
                )}
              </View>
            </View> */}
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.cardsScrollContainer}
            contentContainerStyle={styles.cardsScrollContent}
          >
            {/* Date Range Filter Card */}
            <View style={styles.dateFilterCard}>
              <View style={styles.filterHeader}>
                <Text style={styles.filterTitle}>Filter by Date Range</Text>
              </View>
              <View style={styles.filterContent}>
                <View style={styles.filterInputGroup}>
                  <Text style={styles.filterLabel}>From:</Text>
                  {isWeb ? (
                    <View
                      style={{
                        position: "relative",
                        zIndex: showWebFromCalendar ? 100 : 1,
                      }}
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
                            {[
                              "Sun",
                              "Mon",
                              "Tue",
                              "Wed",
                              "Thu",
                              "Fri",
                              "Sat",
                            ].map((day) => (
                              <Text key={day} style={styles.calendarWeekDay}>
                                {day}
                              </Text>
                            ))}
                          </View>

                          <View style={styles.calendarDaysGrid}>
                            {(() => {
                              const year = webCalendarDate.getFullYear();
                              const month = webCalendarDate.getMonth();
                              const firstDay = new Date(
                                year,
                                month,
                                1
                              ).getDay();
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
                      <Ionicons
                        name="calendar-outline"
                        size={16}
                        color="#6B7280"
                      />
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
                            {[
                              "Sun",
                              "Mon",
                              "Tue",
                              "Wed",
                              "Thu",
                              "Fri",
                              "Sat",
                            ].map((day) => (
                              <Text key={day} style={styles.calendarWeekDay}>
                                {day}
                              </Text>
                            ))}
                          </View>

                          <View style={styles.calendarDaysGrid}>
                            {(() => {
                              const year = webCalendarDate.getFullYear();
                              const month = webCalendarDate.getMonth();
                              const firstDay = new Date(
                                year,
                                month,
                                1
                              ).getDay();
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
                      <Ionicons
                        name="calendar-outline"
                        size={16}
                        color="#6B7280"
                      />
                    </Pressable>
                  )}
                </View>
              </View>

              {/* Mobile Date Pickers */}
              {!isWeb && (
                <>
                  <DateTimePickerModal
                    isVisible={isFromDatePickerVisible}
                    mode="date"
                    onConfirm={handleFromDateConfirm}
                    onCancel={hideFromDatePicker}
                    date={filterFromDate || new Date()}
                  />
                  <DateTimePickerModal
                    isVisible={isToDatePickerVisible}
                    mode="date"
                    onConfirm={handleToDateConfirm}
                    onCancel={hideToDatePicker}
                    date={filterToDate || new Date()}
                  />
                </>
              )}

              <View style={styles.filterButtonContainer}>
                <Pressable
                  style={[styles.filterButton, styles.clearButton]}
                  onPress={handleClearFilters}
                >
                  <Ionicons name="close-circle" size={14} color="#FFFFFF" />
                  <Text style={styles.clearButtonText}>Clear</Text>
                </Pressable>
              </View>
            </View>
          </ScrollView>
        </View>

        {/* Data Table */}
        <View style={dtrStyles.tableContainer}>
          <DTRTable
            selectedUserType={selectedUserType}
            searchText={searchText}
          />
        </View>
      </ScrollView>
      <BottomNavigation />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  filtersWrapper: {
    gap: 16,
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  dateFilterCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  userTypeSearchCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    gap: 16,
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
  },
  filterInputGroup: {
    flex: 1,
    position: "relative",
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
    gap: 8,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 4,
  },
  clearButton: {
    backgroundColor: "#EF4444",
  },
  clearButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  userTypeSection: {
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  searchSection: {},
  sectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 12,
  },
  filterButtonsContainer: {
    flexDirection: "row",
    gap: 8,
  },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  filterChipActive: {
    backgroundColor: "#FFF7ED",
    borderColor: "#F97316",
  },
  filterChipText: {
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "500",
  },
  filterChipTextActive: {
    color: "#F97316",
    fontWeight: "600",
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  searchInputField: {
    flex: 1,
    fontSize: 14,
    color: "#1F2937",
    padding: 0,
  },
  webCalendarDropdown: {
    position: "absolute",
    top: 42,
    left: 0,
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
});

export default DTRScreen;
