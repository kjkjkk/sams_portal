import ApiService from "@/services/api";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const SchoolFilter = ({
  selectedSchool,
  onSchoolChange,
  disabled = false, // ✅ New prop to disable the dropdown
}) => {
  const [schools, setSchools] = useState([]);
  const [localSelectedSchool, setLocalSelectedSchool] = useState("All Schools");
  const [showSchoolDropdown, setShowSchoolDropdown] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch schools from database on mount
  useEffect(() => {
    const fetchSchools = async () => {
      try {
        setLoading(true);
        const response = await ApiService.getSchools();

        if (response.success && response.data) {
          // Filter only active schools
          const schoolList = response.data
            .filter((school) => school.accActive === 1)
            .map((school) => ({
              accID: school.accID,
              accName: school.accName,
            }));
          setSchools(schoolList);
        } else {
          throw new Error(response.message || "Failed to fetch schools");
        }
      } catch (err) {
        console.error("[SchoolFilter] Error fetching schools:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSchools();
  }, []);

  const handleSelectSchool = (school) => {
    // ✅ Prevent selection if disabled
    if (disabled) return;

    if (school === null) {
      setLocalSelectedSchool("All Schools");
      if (onSchoolChange) onSchoolChange(null);
    } else {
      setLocalSelectedSchool(school.accName);
      if (onSchoolChange) onSchoolChange(school.accID);
    }
    setShowSchoolDropdown(false);
  };

  // Get current display text
  const getDisplayText = () => {
    if (selectedSchool !== undefined) {
      if (!selectedSchool) return "All Schools";
      const school = schools.find((s) => s.accID === selectedSchool);
      return school ? school.accName : "All Schools";
    }
    return localSelectedSchool;
  };

  // Check if a school is currently selected
  const isSelected = (school) => {
    if (selectedSchool !== undefined) {
      return school ? selectedSchool === school.accID : !selectedSchool;
    }
    return school
      ? localSelectedSchool === school.accName
      : localSelectedSchool === "All Schools";
  };

  if (loading) {
    return (
      <View style={styles.dropdownWrapper}>
        <View style={styles.dropdown}>
          <ActivityIndicator size="small" color="#666" />
          <Text style={styles.dropdownText}>Loading...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.dropdownWrapper}>
        <View style={[styles.dropdown, styles.dropdownError]}>
          <Text style={styles.errorText}>Failed to load</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.dropdownWrapper}>
      <View style={styles.filterHeader}>
        <Text style={styles.filterTitle}>School Filter</Text>
      </View>
      <TouchableOpacity
        style={[
          styles.dropdown,
          disabled && styles.dropdownDisabled, // ✅ Add disabled style
        ]}
        onPress={() => !disabled && setShowSchoolDropdown(!showSchoolDropdown)} // ✅ Prevent opening if disabled
        disabled={disabled} // ✅ Disable touch
      >
        <Text
          style={[
            styles.dropdownText,
            disabled && styles.dropdownTextDisabled, // ✅ Gray out text when disabled
          ]}
        >
          {getDisplayText()}
        </Text>
        <Ionicons
          name="chevron-down"
          size={20}
          color={disabled ? "#ccc" : "#666"} // ✅ Gray out icon when disabled
        />
      </TouchableOpacity>

      {/* ✅ Only show dropdown menu if not disabled */}
      {showSchoolDropdown && !disabled && (
        <View style={styles.dropdownMenu}>
          <TouchableOpacity
            style={[
              styles.dropdownItem,
              isSelected(null) && styles.dropdownItemActive,
            ]}
            onPress={() => handleSelectSchool(null)}
          >
            <Text
              style={[
                styles.dropdownItemText,
                isSelected(null) && styles.dropdownItemTextActive,
              ]}
            >
              All Schools
            </Text>
          </TouchableOpacity>

          {schools.map((school) => (
            <TouchableOpacity
              key={school.accID}
              style={[
                styles.dropdownItem,
                isSelected(school) && styles.dropdownItemActive,
              ]}
              onPress={() => handleSelectSchool(school)}
            >
              <Text
                style={[
                  styles.dropdownItemText,
                  isSelected(school) && styles.dropdownItemTextActive,
                ]}
              >
                {school.accName}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

export default SchoolFilter;

const styles = StyleSheet.create({
  dropdownWrapper: {
    paddingHorizontal: 14,
    marginBottom: 12,
  },
  dropdown: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
  },
  dropdownDisabled: {
    // ✅ New disabled style
    backgroundColor: "#f3f3f3",
    borderColor: "#e5e5e5",
    opacity: 0.6,
  },
  dropdownError: {
    borderColor: "#EF4444",
  },
  dropdownText: {
    fontSize: 12,
    color: "#999",
    fontWeight: "500",
  },
  dropdownTextDisabled: {
    // ✅ New disabled text style
    color: "#aaa",
  },
  errorText: {
    fontSize: 12,
    color: "#EF4444",
  },
  dropdownMenu: {
    marginTop: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    overflow: "hidden",
  },
  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  dropdownItemActive: {
    backgroundColor: "#FFF7ED",
  },
  dropdownItemText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  dropdownItemTextActive: {
    color: "#F97316",
    fontWeight: "600",
  },
  filterHeader: {
    marginBottom: 16,
    // paddingHorizontal: 16,
  },
  filterTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1F2937",
  },
});
