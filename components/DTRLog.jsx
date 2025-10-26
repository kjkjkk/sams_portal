import { ScrollView, StyleSheet, Text, View } from "react-native";

const dtrData = [
  {
    id: 1,
    name: "Pinning Garcia",
    school: "UM-Main",
    timeIn: "8:14:53",
    timeOut: "17:01",
    date: "2024-01-15",
  },
  {
    id: 2,
    name: "Pinning Garcia",
    school: "UM-Main",
    timeIn: "7:24:23",
    timeOut: "18:12",
    date: "2024-01-14",
  },
  {
    id: 3,
    name: "Pinning Garcia",
    school: "UM-Main",
    timeIn: "7:47:59",
    timeOut: "17:14",
    date: "2024-01-13",
  },
  {
    id: 4,
    name: "Pinning Garcia",
    school: "UM-Main",
    timeIn: "7:28:53",
    timeOut: "18:50",
    date: "2024-01-12",
  },
  {
    id: 5,
    name: "Pinning Garcia",
    school: "UM-Main",
    timeIn: "8:21:06",
    timeOut: "17:11",
    date: "2024-01-11",
  },
  {
    id: 6,
    name: "Pinning Garcia",
    school: "UM-Main",
    timeIn: "8:01:11",
    timeOut: "18:12",
    date: "2024-01-10",
  },
  {
    id: 7,
    name: "Pinning Garcia",
    school: "UM-Main",
    timeIn: "7:14:26",
    timeOut: "17:01",
    date: "2024-01-09",
  },
  {
    id: 1,
    name: "Pinning Garcia",
    school: "UM-Main",
    timeIn: "8:14:53",
    timeOut: "17:01",
    date: "2024-01-15",
  },
  {
    id: 2,
    name: "Pinning Garcia",
    school: "UM-Main",
    timeIn: "7:24:23",
    timeOut: "18:12",
    date: "2024-01-14",
  },
  {
    id: 3,
    name: "Pinning Garcia",
    school: "UM-Main",
    timeIn: "7:47:59",
    timeOut: "17:14",
    date: "2024-01-13",
  },
  {
    id: 4,
    name: "Pinning Garcia",
    school: "UM-Main",
    timeIn: "7:28:53",
    timeOut: "18:50",
    date: "2024-01-12",
  },
  {
    id: 5,
    name: "Pinning Garcia",
    school: "UM-Main",
    timeIn: "8:21:06",
    timeOut: "17:11",
    date: "2024-01-11",
  },
  {
    id: 6,
    name: "Pinning Garcia",
    school: "UM-Main",
    timeIn: "8:01:11",
    timeOut: "18:12",
    date: "2024-01-10",
  },
  {
    id: 7,
    name: "Pinning Garcia",
    school: "UM-Main",
    timeIn: "7:14:26",
    timeOut: "17:01",
    date: "2024-01-09",
  },
  {
    id: 1,
    name: "Pinning Garcia",
    school: "UM-Main",
    timeIn: "8:14:53",
    timeOut: "17:01",
    date: "2024-01-15",
  },
  {
    id: 2,
    name: "Pinning Garcia",
    school: "UM-Main",
    timeIn: "7:24:23",
    timeOut: "18:12",
    date: "2024-01-14",
  },
  {
    id: 3,
    name: "Pinning Garcia",
    school: "UM-Main",
    timeIn: "7:47:59",
    timeOut: "17:14",
    date: "2024-01-13",
  },
  {
    id: 4,
    name: "Pinning Garcia",
    school: "UM-Main",
    timeIn: "7:28:53",
    timeOut: "18:50",
    date: "2024-01-12",
  },
  {
    id: 5,
    name: "Pinning Garcia",
    school: "UM-Main",
    timeIn: "8:21:06",
    timeOut: "17:11",
    date: "2024-01-11",
  },
  {
    id: 6,
    name: "Pinning Garcia",
    school: "UM-Main",
    timeIn: "8:01:11",
    timeOut: "18:12",
    date: "2024-01-10",
  },
  {
    id: 7,
    name: "Pinning Garcia",
    school: "UM-Main",
    timeIn: "7:14:26",
    timeOut: "17:01",
    date: "2024-01-09",
  },
  {
    id: 1,
    name: "Pinning Garcia",
    school: "UM-Main",
    timeIn: "8:14:53",
    timeOut: "17:01",
    date: "2024-01-15",
  },
  {
    id: 2,
    name: "Pinning Garcia",
    school: "UM-Main",
    timeIn: "7:24:23",
    timeOut: "18:12",
    date: "2024-01-14",
  },
  {
    id: 3,
    name: "Pinning Garcia",
    school: "UM-Main",
    timeIn: "7:47:59",
    timeOut: "17:14",
    date: "2024-01-13",
  },
  {
    id: 4,
    name: "Pinning Garcia",
    school: "UM-Main",
    timeIn: "7:28:53",
    timeOut: "18:50",
    date: "2024-01-12",
  },
  {
    id: 5,
    name: "Pinning Garcia",
    school: "UM-Main",
    timeIn: "8:21:06",
    timeOut: "17:11",
    date: "2024-01-11",
  },
  {
    id: 6,
    name: "Pinning Garcia",
    school: "UM-Main",
    timeIn: "8:01:11",
    timeOut: "18:12",
    date: "2024-01-10",
  },
  {
    id: 7,
    name: "Pinning Garcia",
    school: "UM-Main",
    timeIn: "7:14:26",
    timeOut: "17:01",
    date: "2024-01-09",
  },
  {
    id: 1,
    name: "Pinning Garcia",
    school: "UM-Main",
    timeIn: "8:14:53",
    timeOut: "17:01",
    date: "2024-01-15",
  },
  {
    id: 2,
    name: "Pinning Garcia",
    school: "UM-Main",
    timeIn: "7:24:23",
    timeOut: "18:12",
    date: "2024-01-14",
  },
  {
    id: 3,
    name: "Pinning Garcia",
    school: "UM-Main",
    timeIn: "7:47:59",
    timeOut: "17:14",
    date: "2024-01-13",
  },
  {
    id: 4,
    name: "Pinning Garcia",
    school: "UM-Main",
    timeIn: "7:28:53",
    timeOut: "18:50",
    date: "2024-01-12",
  },
  {
    id: 5,
    name: "Pinning Garcia",
    school: "UM-Main",
    timeIn: "8:21:06",
    timeOut: "17:11",
    date: "2024-01-11",
  },
  {
    id: 6,
    name: "Pinning Garcia",
    school: "UM-Main",
    timeIn: "8:01:11",
    timeOut: "18:12",
    date: "2024-01-10",
  },
  {
    id: 7,
    name: "Pinning Garcia",
    school: "UM-Main",
    timeIn: "7:14:26",
    timeOut: "17:01",
    date: "2024-01-09",
  },
];

export default function DTRTable() {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View style={styles.tableContainer}>
        {/* Table Header */}
        <View style={[styles.row, styles.headerRow]}>
          <Text style={[styles.cell, styles.headerCell, { width: 60 }]}>
            ID
          </Text>
          <Text style={[styles.cell, styles.headerCell, { flex: 1.2 }]}>
            Name
          </Text>
          <Text style={[styles.cell, styles.headerCell, { flex: 1 }]}>
            School
          </Text>
          <Text style={[styles.cell, styles.headerCell, { flex: 1 }]}>
            Time In
          </Text>
          <Text style={[styles.cell, styles.headerCell, { flex: 1 }]}>
            Time Out
          </Text>
          <Text style={[styles.cell, styles.headerCell, { flex: 1 }]}>
            Date
          </Text>
        </View>

        {/* Table Rows */}
        <ScrollView style={{ maxHeight: 700 }}>
          {dtrData.map((entry, index) => (
            <View
              key={index}
              style={[
                styles.row,
                index % 2 === 0 ? styles.evenRow : styles.oddRow,
              ]}
            >
              <Text style={[styles.cell, { width: 60 }]}>{entry.id}</Text>
              <Text style={[styles.cell, { flex: 1.2 }]}>{entry.name}</Text>
              <Text style={[styles.cell, { flex: 1 }]}>{entry.school}</Text>
              <Text style={[styles.cell, { flex: 1 }]}>{entry.timeIn}</Text>
              <Text style={[styles.cell, { flex: 1 }]}>{entry.timeOut}</Text>
              <Text style={[styles.cell, { flex: 1 }]}>{entry.date}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  tableContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#fff",
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerRow: {
    backgroundColor: "#f5f5f5",
  },
  evenRow: {
    backgroundColor: "#fff",
  },
  oddRow: {
    backgroundColor: "#f9f9f9",
  },
  cell: {
    paddingVertical: 10,
    paddingHorizontal: 8,
    fontSize: 13,
    color: "#333",
  },
  headerCell: {
    fontWeight: "700",
    color: "#000",
  },
});
