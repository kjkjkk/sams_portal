import DTRTable from "@/components/DTRScreen/DTRTable";
import BottomNavigation from "@/components/layout/bottom-navigation";
import Header from "@/components/layout/header";
import dtrStyles from "@/styles/dtrStyles";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const DTRScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();

  const [searchText, setSearchText] = useState("");
  const [selectedUserType, setSelectedUserType] = useState("all");

  const userTypes = [
    "All",
    "Admin",
    "Student",
    "Faculty",
    "Employee",
    "Program Head",
    "SA",
  ];

  return (
    <SafeAreaView style={dtrStyles.container}>
      <ScrollView
        style={dtrStyles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <Header />

        {/* DTR Title Section */}
        <View style={dtrStyles.dtrHeaderContainer}>
          <Ionicons name="time" size={24} color="#000" />
          <Text style={dtrStyles.dtrTitle}>Daily Time Record</Text>
          <View style={dtrStyles.divider} />
        </View>

        {/* User Type Filter */}
        <View style={dtrStyles.filterContainer}>
          <Text style={dtrStyles.filterLabel}>User Type</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={dtrStyles.filterButtonsContainer}>
              {userTypes.map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    dtrStyles.filterButton,
                    selectedUserType === type && dtrStyles.filterButtonActive,
                  ]}
                  onPress={() => setSelectedUserType(type)}
                >
                  {selectedUserType === type && (
                    <Ionicons
                      name="chevron-forward"
                      size={16}
                      color="#17A2B8"
                    />
                  )}
                  <Text
                    style={[
                      dtrStyles.filterButtonText,
                      selectedUserType === type &&
                        dtrStyles.filterButtonTextActive,
                    ]}
                  >
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Search Bar */}
        <View style={dtrStyles.searchContainer}>
          <TextInput
            style={dtrStyles.searchInput}
            placeholder="Search..."
            placeholderTextColor="#999"
            value={searchText}
            onChangeText={setSearchText}
          />
          <TouchableOpacity style={dtrStyles.searchButton}>
            <Ionicons name="search" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Data Table */}
        <View style={dtrStyles.tableContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={true}>
            {/* Pass filters directly to DTRTable */}
            <DTRTable
              selectedUserType={selectedUserType}
              searchText={searchText}
            />
          </ScrollView>
        </View>
      </ScrollView>
      <BottomNavigation />
    </SafeAreaView>
  );
};

export default DTRScreen;
