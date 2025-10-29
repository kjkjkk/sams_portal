import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const DTRTable = ({ data }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [items, setItems] = useState([
    { label: "5", value: 5 },
    { label: "10", value: 10 },
    { label: "15", value: 15 },
    { label: "20", value: 20 },
  ]);
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
  const router = useRouter();
  // const renderRow = ({ item, index }) => (
  //   <View
  //     style={[styles.tableRow, index % 2 === 0 && styles.tableRowAlternate]}
  //   >
  //     <Text style={[styles.tableCell, styles.idCell]}>{item.id}</Text>
  //     <Text style={[styles.tableCell, styles.nameCell]}>{item.name}</Text>
  //     <Text style={[styles.tableCell, styles.schoolCell]}>{item.school}</Text>
  //     <Text style={[styles.tableCell, styles.userTypeCell]}>
  //       {item.userType}
  //     </Text>
  //     <Text style={[styles.tableCell, styles.statusCell]}>{item.status}</Text>
  //     <View style={[styles.tableCell, styles.actionsCell]}>
  //       <TouchableOpacity style={styles.actionButton}>
  //         <Ionicons name="pencil-sharp" size={20} color="#4CAF50" />
  //       </TouchableOpacity>
  //       <TouchableOpacity
  //         style={styles.actionButton}
  //         onPress={() => router.push("/dtrlogs")}
  //       >
  //         <Ionicons name="eye-sharp" size={20} color="#008cffff" />
  //       </TouchableOpacity>
  //     </View>
  //   </View>
  // );

  const totalPages = Math.ceil(dtrData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedData = dtrData.slice(startIndex, startIndex + rowsPerPage);

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.tableScroll}
    >
      <View style={styles.table}>
        {/* Table Header */}
        <View style={styles.tableRow}>
          <Text style={[styles.tableCell, styles.tableHeader, { width: 50 }]}>
            ID
          </Text>
          <Text style={[styles.tableCell, styles.tableHeader, { width: 140 }]}>
            Name
          </Text>
          <Text style={[styles.tableCell, styles.tableHeader, { width: 100 }]}>
            School
          </Text>
          <Text style={[styles.tableCell, styles.tableHeader, { width: 100 }]}>
            User Type
          </Text>
          <Text style={[styles.tableCell, styles.tableHeader, { width: 100 }]}>
            Status
          </Text>
          <Text style={[styles.tableCell, styles.tableHeader, { width: 100 }]}>
            Action
          </Text>
        </View>

        {/* Table Rows */}
        {paginatedData.map((item, index) => (
          <View
            key={index}
            style={[styles.tableRow, index % 2 === 0 && styles.tableRowAlt]}
          >
            <Text style={[styles.tableCell, { width: 50 }]}>{item.id}</Text>
            <Text style={[styles.tableCell, { width: 140 }]}>{item.name}</Text>
            <Text style={[styles.tableCell, { width: 100 }]}>
              {item.school}
            </Text>
            <Text style={[styles.tableCell, { width: 100 }]}>
              {item.userType}
            </Text>
            <Text style={[styles.tableCell, { width: 100 }]}>
              {item.status}
            </Text>
            <View style={[styles.tableCell, styles.actionsCell]}>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="pencil-sharp" size={20} color="#4CAF50" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => router.push("/dtrlogs")}
              >
                <Ionicons name="eye-sharp" size={20} color="#008cffff" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  tableContainer: {
    marginHorizontal: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    overflow: "hidden",
  },
  tableScroll: {
    borderRadius: 8,
    overflow: "hidden",
  },
  tableHeader: {
    backgroundColor: "#FF8C00",
    color: "#FFFFFF",
    fontWeight: "600",
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  tableCell: {
    fontSize: 12,
    color: "#111827",
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRightWidth: 1, // This creates the separator
    borderRightColor: "#E5E7EB", // This creates the separator
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  tableRowAlternate: {
    backgroundColor: "#fafafa",
  },
  idCell: { flex: 0.8, minWidth: 60 },
  nameCell: { flex: 1.5, minWidth: 180 },
  schoolCell: { flex: 1, minWidth: 100 },
  userTypeCell: { flex: 1, minWidth: 100 },
  statusCell: { flex: 0.9, minWidth: 100 },
  actionsCell: {
    flex: 1,
    minWidth: 100,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  actionButton: {
    padding: 6,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default DTRTable;
