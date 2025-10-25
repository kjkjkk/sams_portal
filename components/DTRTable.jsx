import { Ionicons } from "@expo/vector-icons";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const DTRTable = ({ data }) => {
  const renderRow = ({ item, index }) => (
    <View
      style={[styles.tableRow, index % 2 === 0 && styles.tableRowAlternate]}
    >
      <Text style={[styles.tableCell, styles.idCell]}>{item.id}</Text>
      <Text style={[styles.tableCell, styles.nameCell]}>{item.name}</Text>
      <Text style={[styles.tableCell, styles.schoolCell]}>{item.school}</Text>
      <Text style={[styles.tableCell, styles.userTypeCell]}>
        {item.userType}
      </Text>
      <Text style={[styles.tableCell, styles.statusCell]}>{item.status}</Text>
      <View style={[styles.tableCell, styles.actionsCell]}>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="pencil-sharp" size={20} color="#4CAF50" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="trash" size={20} color="#FF5252" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.tableContainer}>
      <View style={styles.tableHeader}>
        <Text style={[styles.tableHeaderCell, styles.idCell]}>ID</Text>
        <Text style={[styles.tableHeaderCell, styles.nameCell]}>Name</Text>
        <Text style={[styles.tableHeaderCell, styles.schoolCell]}>School</Text>
        <Text style={[styles.tableHeaderCell, styles.userTypeCell]}>
          User Type
        </Text>
        <Text style={[styles.tableHeaderCell, styles.statusCell]}>Status</Text>
        <Text style={[styles.tableHeaderCell, styles.actionsCell]}>
          Actions
        </Text>
      </View>
      <FlatList
        data={data}
        renderItem={renderRow}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        scrollEnabled={false}
      />
    </View>
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
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f5f5f5",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  tableHeaderCell: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 13,
    fontWeight: "700",
    color: "#333",
    textAlign: "center",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    backgroundColor: "#fff",
  },
  tableRowAlternate: {
    backgroundColor: "#fafafa",
  },
  tableCell: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 13,
    color: "#333",
    textAlign: "center",
  },
  idCell: { flex: 0.8, minWidth: 50 },
  nameCell: { flex: 1.5, minWidth: 150 },
  schoolCell: { flex: 1, minWidth: 100 },
  userTypeCell: { flex: 1, minWidth: 100 },
  statusCell: { flex: 0.9, minWidth: 80 },
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
