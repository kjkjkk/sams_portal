import DTRTable from "@/components/DTRScreen/DTRTable";
import BottomNavigation from "@/components/layout/bottom-navigation";
import Header from "@/components/layout/header";
import SchoolFilter from "@/components/school-filter";
import SearchFilter from "@/components/search-filter";
import { useAuth } from "@/contexts/AuthContexts";
import { useTheme } from "@/contexts/ThemeContext"; // ✅ Import useTheme
import createDtrStyles from "@/styles/appScreenStyles/dtrStyles"; // ✅ Import function, not object
import { isLMSAdminUser } from "@/utils/roleUtils";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import DateFilter from "components/date-range-filter";
import { useEffect, useMemo, useState } from "react";
import {
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const DTRScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { user } = useAuth();
  const { theme } = useTheme(); // ✅ Get theme from context

  // ✅ Create styles using theme
  const dtrStyles = useMemo(() => createDtrStyles(theme), [theme]);

  const [searchText, setSearchText] = useState("");
  const [selectedUserType, setSelectedUserType] = useState(null);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [schoolName, setSchoolName] = useState("");

  // ✅ Auto-set school for LMS Admin and fetch school name
  useEffect(() => {
    const fetchSchoolName = async () => {
      if (user && isLMSAdminUser(user.usrType)) {
        console.log(
          "[DTRScreen] LMS Admin detected, setting school to:",
          user.accID
        );
        setSelectedSchool(user.accID);

        // ✅ Fetch school name from API
        try {
          const ApiService = (await import("@/services/api")).default;
          const response = await ApiService.getSchool(user.accID);
          if (response.success && response.data) {
            setSchoolName(response.data.accName);
            console.log("[DTRScreen] School name:", response.data.accName);
          }
        } catch (error) {
          console.error("[DTRScreen] Failed to fetch school name:", error);
          setSchoolName("your school");
        }
      }
    };

    fetchSchoolName();
  }, [user]);

  // Date filter states
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

  const isWeb = Platform.OS === "web";

  const userTypes = [
    { id: null, label: "All" },
    { id: 2, label: "LMS Admin" },
    { id: 3, label: "Faculty" },
    { id: 4, label: "Student" },
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

  const handleSearchFilters = () => {
    setAppliedFromDate(filterFromDate);
    setAppliedToDate(filterToDate);
  };

  const handleClearFilters = () => {
    setFilterFromDate(null);
    setFilterToDate(null);
    setAppliedFromDate(null);
    setAppliedToDate(null);
  };

  const formatDisplayDate = (date) => {
    if (!date) return "Select Date";
    return new Date(date).toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });
  };

  const handleSchoolChange = (accID) => {
    if (user && isLMSAdminUser(user.usrType)) {
      console.log("[DTRScreen] LMS Admin cannot change school");
      return;
    }
    console.log("[DTRScreen] School changed to:", accID);
    setSelectedSchool(accID);
  };

  const isSchoolFilterDisabled = user && isLMSAdminUser(user.usrType);

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
          <Ionicons name="time" size={36} color={theme.primary} />
          <Text style={dtrStyles.dtrTitle}>Daily Time Record</Text>
          <View style={dtrStyles.divider} />
        </View>

        {/* Combined Filters Container */}
        <View style={dtrStyles.filtersWrapper}>
          {/* ✅ Info Banner - RIGHT ABOVE User Type Filter */}
          {isLMSAdminUser(user?.usrType) && (
            <View style={dtrStyles.infoBanner}>
              <Ionicons
                name="information-circle"
                size={20}
                color={theme.primary}
              />
              <Text style={dtrStyles.infoBannerText}>
                Viewing DTR records of {schoolName || "your school"}
              </Text>
            </View>
          )}

          {/* User Type Filter */}
          <View style={dtrStyles.userTypeSearchCard}>
            <View style={dtrStyles.userTypeSection}>
              <Text style={dtrStyles.sectionTitle}>User Type</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={dtrStyles.filterButtonsContainer}>
                  {userTypes.map((type) => (
                    <TouchableOpacity
                      key={type.id ?? "all"}
                      style={[
                        dtrStyles.filterChip,
                        selectedUserType === type.id &&
                          dtrStyles.filterChipActive,
                      ]}
                      onPress={() => setSelectedUserType(type.id)}
                    >
                      {selectedUserType === type.id && (
                        <Ionicons
                          name="checkmark-circle"
                          size={16}
                          color={theme.primary}
                          style={{ marginRight: 4 }}
                        />
                      )}
                      <Text
                        style={[
                          dtrStyles.filterChipText,
                          selectedUserType === type.id &&
                            dtrStyles.filterChipTextActive,
                        ]}
                      >
                        {type.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={dtrStyles.cardsScrollContainer}
            contentContainerStyle={dtrStyles.cardsScrollContent}
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

            {/* ✅ Search Filter Card - No School Filter Inside */}
            <View style={dtrStyles.cardHorizontal}>
              <SearchFilter
                searchText={searchText}
                setSearchText={setSearchText}
                placeholder="Search users..."
                showButton={false}
              />

              <SchoolFilter
                selectedSchool={selectedSchool}
                onSchoolChange={handleSchoolChange}
                disabled={isSchoolFilterDisabled}
              />
            </View>
          </ScrollView>
        </View>

        {/* Data Table */}
        <View style={dtrStyles.tableContainer}>
          <DTRTable
            selectedUserType={selectedUserType}
            searchText={searchText}
            appliedFromDate={appliedFromDate}
            appliedToDate={appliedToDate}
            selectedSchool={selectedSchool}
          />
        </View>
      </ScrollView>
      <BottomNavigation />
    </SafeAreaView>
  );
};

export default DTRScreen;
