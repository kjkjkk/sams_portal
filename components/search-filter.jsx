import { Ionicons } from "@expo/vector-icons";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const SearchFilter = ({
  // Search props
  searchText = "",
  setSearchText,
  placeholder = "Search...",

  // Button props (optional)
  showButton = true,
  buttonText = "Create New",
  buttonIcon = "add",
  onButtonPress,

  // Style customization (optional)
  containerStyle,
  inputStyle,
  buttonStyle,
}) => {
  return (
    <>
      <View style={styles.filterHeader}>
        <Text style={styles.filterTitle}>Search Filter</Text>
      </View>
      <View style={[styles.searchContainer, containerStyle]}>
        <View style={styles.searchInputWrapper}>
          <Ionicons
            name="search"
            size={14}
            color="#999"
            style={styles.searchIcon}
          />
          <TextInput
            style={[styles.searchInput, inputStyle]}
            placeholder={placeholder}
            placeholderTextColor="#999"
            value={searchText}
            onChangeText={setSearchText}
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => setSearchText("")}>
              <Ionicons name="close-circle" size={18} color="#999" />
            </TouchableOpacity>
          )}
        </View>

        {showButton && onButtonPress && (
          <TouchableOpacity
            style={[styles.createButton, buttonStyle]}
            onPress={onButtonPress}
          >
            <Ionicons name={buttonIcon} size={14} color="#fff" />
            <Text style={styles.createButtonText}>{buttonText}</Text>
          </TouchableOpacity>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  searchInputWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: "#1F2937",
    padding: 0,
  },
  filterHeader: {
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  filterTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1F2937",
  },
  createButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF8C00",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  createButtonText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "600",
  },
});

export default SearchFilter;
