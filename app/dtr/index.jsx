import Imageicn from "@/assets/images/Imageicn.png";
import BottomNavigation from "@/components/bottom-navigation";
import DTRTable from "@/components/DTRTable";
import dtrStyles from "@/styles/dtrStyles";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useState } from "react";
import {
  Image,
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
  const [selectedUserType, setSelectedUserType] = useState("Admin");
  const [showUserTypeDropdown, setShowUserTypeDropdown] = useState(false);

  const userTypes = [
    "Admin",
    "Student",
    "Faculty",
    "Employee",
    "Program Head",
    "SA",
  ];

  const dtrData = [
    {
      id: "345",
      name: "Whang D. Oda",
      school: "MAPUA",
      userType: "Admin",
      status: "Active",
    },
    {
      id: "346",
      name: "Quynh Dao",
      school: "UM",
      userType: "Admin",
      status: "Active",
    },
    {
      id: "347",
      name: "PAUL JOSEPH ENCALLADO",
      school: "SPC",
      userType: "Admin",
      status: "Active",
    },
    {
      id: "312",
      name: "DEVIN REVILLA",
      school: "UIC",
      userType: "Admin",
      status: "Active",
    },
    {
      id: "423",
      name: "KATE MELODY PAGAS",
      school: "AGRO",
      userType: "Admin",
      status: "Active",
    },
    {
      id: "432",
      name: "BONG REVILLA",
      school: "DMMA",
      userType: "Admin",
      status: "Active",
    },
    {
      id: "476",
      name: "ELLEINE JOY AGUIRRE",
      school: "HCDC",
      userType: "Admin",
      status: "Active",
    },
    {
      id: "523",
      name: "RODEL JUN HERNANDEZ",
      school: "AMYA-POLY",
      userType: "Admin",
      status: "Active",
    },
    {
      id: "532",
      name: "MARY ANN PIA",
      school: "SPC",
      userType: "Admin",
      status: "Active",
    },
    {
      id: "533",
      name: "RODEL JUN HERNANDEZ",
      school: "HCDC",
      userType: "Admin",
      status: "Active",
    },
    {
      id: "534",
      name: "Ram Irenz Oniez",
      school: "UIC",
      userType: "Admin",
      status: "Active",
    },
    {
      id: "534",
      name: "Aika Ryah Doring",
      school: "DMMA",
      userType: "Admin",
      status: "Active",
    },
    {
      id: "569",
      name: "Marc Luis Rojas",
      school: "AGRO",
      userType: "Admin",
      status: "Active",
    },
    {
      id: "731",
      name: "Whang D. Oda",
      school: "UM",
      userType: "Admin",
      status: "Active",
    },
    {
      id: "666",
      name: "Whang D. Oda",
      school: "UM",
      userType: "Admin",
      status: "Active",
    },
    {
      id: "699",
      name: "Whang D. Oda",
      school: "AMYA-POLY",
      userType: "Admin",
      status: "Active",
    },
    {
      id: "879",
      name: "Whang D. Oda",
      school: "UM",
      userType: "Admin",
      status: "Active",
    },
  ];

  const filteredData = dtrData.filter(
    (item) =>
      (selectedUserType === "All" || item.userType === selectedUserType) &&
      (item.name.toLowerCase().includes(searchText.toLowerCase()) ||
        item.id.includes(searchText) ||
        item.school.toLowerCase().includes(searchText.toLowerCase()))
  );

  return (
    <SafeAreaView style={dtrStyles.container}>
      <ScrollView
        style={dtrStyles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={dtrStyles.header}>
          <View style={dtrStyles.headerContent}>
            <Text style={dtrStyles.welcomeText}>Welcome to INFINITLMS</Text>
            <View style={dtrStyles.userSection}>
              <Image source={Imageicn} style={dtrStyles.avatar} />
              <Text style={dtrStyles.userName}>Whang D. Oda</Text>
            </View>
          </View>
          <View style={dtrStyles.logoSection}>
            <Ionicons name="bulb" size={48} color="#FF9500" />
            <Text style={dtrStyles.logoText}>INFINIT LMS</Text>
          </View>
        </View>

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
            <DTRTable data={filteredData} />
          </ScrollView>
        </View>
      </ScrollView>
      <BottomNavigation />
    </SafeAreaView>
  );
};

// const dtrStyles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//   },
//   scrollView: {
//     flex: 1,
//   },
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "flex-start",
//     paddingHorizontal: 16,
//     paddingVertical: 20,
//     borderBottomWidth: 1,
//     borderBottomColor: "#f0f0f0",
//   },
//   headerContent: {
//     flex: 1,
//   },
//   welcomeText: {
//     fontSize: 20,
//     fontWeight: "700",
//     color: "#000",
//     marginBottom: 12,
//     letterSpacing: -0.5,
//   },
//   userSection: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 10,
//   },
//   avatar: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//   },
//   userName: {
//     fontSize: 15,
//     fontWeight: "600",
//     color: "#333",
//   },
//   logoSection: {
//     alignItems: "center",
//     gap: 6,
//   },
//   logoText: {
//     fontSize: 11,
//     fontWeight: "700",
//     color: "#666",
//     letterSpacing: 0.5,
//   },
//   dtrHeaderContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingHorizontal: 16,
//     paddingVertical: 16,
//     gap: 12,
//   },
//   dtrTitle: {
//     fontSize: 18,
//     fontWeight: "700",
//     color: "#000",
//     letterSpacing: 0.5,
//   },
//   divider: {
//     flex: 1,
//     height: 1,
//     backgroundColor: "#ddd",
//     marginLeft: 4,
//   },
//   filterContainer: {
//     paddingHorizontal: 16,
//     marginBottom: 16,
//   },
//   filterLabel: {
//     fontSize: 14,
//     fontWeight: "600",
//     color: "#333",
//     marginBottom: 10,
//   },
//   filterButtonsContainer: {
//     flexDirection: "row",
//     gap: 10,
//     alignItems: "center",
//   },
//   filterButton: {
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     borderRadius: 6,
//     borderBottomWidth: 2,
//     borderBottomColor: "transparent",
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 4,
//   },
//   filterButtonActive: {
//     borderBottomColor: "#17A2B8",
//   },
//   filterButtonText: {
//     fontSize: 13,
//     fontWeight: "600",
//     color: "#666",
//   },
//   filterButtonTextActive: {
//     color: "#17A2B8",
//   },
//   searchContainer: {
//     flexDirection: "row",
//     paddingHorizontal: 16,
//     marginBottom: 16,
//     gap: 10,
//   },
//   searchInput: {
//     flex: 1,
//     paddingHorizontal: 14,
//     paddingVertical: 10,
//     borderRadius: 6,
//     borderWidth: 1,
//     borderColor: "#ddd",
//     fontSize: 14,
//     backgroundColor: "#f9f9f9",
//     color: "#333",
//   },
//   searchButton: {
//     backgroundColor: "#17A2B8",
//     paddingHorizontal: 14,
//     paddingVertical: 10,
//     borderRadius: 6,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   tableContainer: {
//     marginHorizontal: 16,
//     marginBottom: 24,
//     borderWidth: 1,
//     borderColor: "#ddd",
//     borderRadius: 8,
//     overflow: "hidden",
//   },
//   tableHeader: {
//     flexDirection: "row",
//     backgroundColor: "#f5f5f5",
//     borderBottomWidth: 1,
//     borderBottomColor: "#ddd",
//   },
//   tableHeaderCell: {
//     paddingHorizontal: 12,
//     paddingVertical: 12,
//     fontSize: 13,
//     fontWeight: "700",
//     color: "#333",
//     textAlign: "center",
//   },
//   tableRow: {
//     flexDirection: "row",
//     borderBottomWidth: 1,
//     borderBottomColor: "#f0f0f0",
//     backgroundColor: "#fff",
//   },
//   tableRowAlternate: {
//     backgroundColor: "#fafafa",
//   },
//   tableCell: {
//     paddingHorizontal: 12,
//     paddingVertical: 12,
//     fontSize: 13,
//     color: "#333",
//     textAlign: "center",
//   },
//   idCell: {
//     flex: 0.8,
//     minWidth: 50,
//   },
//   nameCell: {
//     flex: 1.5,
//     minWidth: 150,
//   },
//   schoolCell: {
//     flex: 1,
//     minWidth: 100,
//   },
//   userTypeCell: {
//     flex: 1,
//     minWidth: 100,
//   },
//   statusCell: {
//     flex: 0.9,
//     minWidth: 80,
//   },
//   actionsCell: {
//     flex: 1,
//     minWidth: 100,
//     flexDirection: "row",
//     justifyContent: "center",
//     alignItems: "center",
//     gap: 8,
//   },
//   actionButton: {
//     padding: 6,
//     justifyContent: "center",
//     alignItems: "center",
//   },
// });

export default DTRScreen;
