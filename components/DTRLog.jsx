"use client";

import { useState } from "react";
import {
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

const DTRStats = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [items, setItems] = useState([
    { label: "5", value: 5 },
    { label: "10", value: 10 },
    { label: "15", value: 15 },
    { label: "20", value: 20 },
  ]);

  // Sample DTR data
  const dtrData = [
    {
      id: 1,
      name: "Pinning Garcasdasdasdia",
      school: "UM-Main",
      timeInAM: "8:14:53",
      timeOutAM: "11:59:12",
      timeInPM: "17:09:53",
      timeOutPM: "17:09:53",
      date: "05-12-25",
    },
    {
      id: 1,
      name: "Pinning Garcia",
      school: "UM-Main",
      timeInAM: "8:14:53",
      timeOutAM: "11:59:12",
      timeInPM: "17:09:53",
      timeOutPM: "17:09:53",
      date: "05-12-25",
    },
    {
      id: 2,
      name: "Pinning Garcia",
      school: "UM-Main",
      timeInAM: "7:24:23",
      timeOutAM: "11:59:12",
      timeInPM: "18:12:53",
      timeOutPM: "17:09:53",
      date: "05-12-25",
    },
    {
      id: 2,
      name: "Pinning Garcia",
      school: "UM-Main",
      timeInAM: "7:24:23",
      timeOutAM: "11:59:12",
      timeInPM: "18:12:53",
      timeOutPM: "17:09:53",
      date: "05-12-25",
    },
    {
      id: 3,
      name: "Pinning Garcia",
      school: "UM-Main",
      timeInAM: "7:47:59",
      timeOutAM: "11:59:12",
      timeInPM: "17:14:53",
      timeOutPM: "17:09:53",
      date: "05-12-25",
    },
    {
      id: 3,
      name: "Pinning Garcia",
      school: "UM-Main",
      timeInAM: "7:47:59",
      timeOutAM: "11:59:12",
      timeInPM: "17:14:53",
      timeOutPM: "17:09:53",
      date: "05-12-25",
    },
    {
      id: 4,
      name: "Pinning Garcia",
      school: "UM-Main",
      timeInAM: "7:28:53",
      timeOutAM: "11:59:12",
      timeInPM: "18:54:53",
      timeOutPM: "17:09:53",
      date: "05-12-25",
    },
    {
      id: 4,
      name: "Pinning Garcia",
      school: "UM-Main",
      timeInAM: "7:28:53",
      timeOutAM: "11:59:12",
      timeInPM: "18:54:53",
      timeOutPM: "17:09:53",
      date: "05-12-25",
    },
    {
      id: 5,
      name: "Pinning Garcia",
      school: "UM-Main",
      timeInAM: "8:21:06",
      timeOutAM: "11:59:12",
      timeInPM: "17:11:53",
      timeOutPM: "17:09:53",
      date: "05-12-25",
    },
    {
      id: 5,
      name: "Pinning Garcia",
      school: "UM-Main",
      timeInAM: "8:21:06",
      timeOutAM: "11:59:12",
      timeInPM: "17:11:53",
      timeOutPM: "17:09:53",
      date: "05-12-25",
    },
  ];

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
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.cardsScrollView}
      >
        <View style={styles.cardsContainer}>
          {/* Total Hours Card */}
          <View style={styles.card}>
            <View style={styles.cardContent}>
              <View style={styles.cardLeft}>
                <Text style={styles.cardTitle}>Total Hours</Text>
                <View style={styles.legendContainer}>
                  <View style={styles.legendItem}>
                    <View
                      style={[styles.legendDot, { backgroundColor: "#EF4444" }]}
                    />
                    <Text style={styles.legendText}>
                      Total Hours: <Text style={styles.legendValue}>160</Text>
                    </Text>
                  </View>
                  <View style={styles.legendItem}>
                    <View
                      style={[styles.legendDot, { backgroundColor: "#F97316" }]}
                    />
                    <Text style={styles.legendText}>
                      Overtime: <Text style={styles.legendValue}>8</Text>
                    </Text>
                  </View>
                  <View style={styles.legendItem}>
                    <View
                      style={[styles.legendDot, { backgroundColor: "#FBBF24" }]}
                    />
                    <Text style={styles.legendText}>
                      Total Break: <Text style={styles.legendValue}>12</Text>
                    </Text>
                  </View>
                </View>
                <View style={styles.cardDivider} />
                <Text style={styles.monthText}>
                  Total Hours of the Month:{" "}
                  <Text style={styles.monthValue}>322</Text>
                </Text>
              </View>
              {/* Pie Chart Placeholder */}
              <View style={styles.chartPlaceholder}>
                <View style={styles.chartInner} />
              </View>
            </View>
          </View>

          {/* Attendance Summary Card */}
          <View style={styles.card}>
            <View style={styles.cardContent}>
              <View style={styles.cardLeft}>
                <Text style={styles.cardTitle}>Attendance Summary</Text>
                <View style={styles.legendContainer}>
                  <View style={styles.legendItem}>
                    <View
                      style={[styles.legendDot, { backgroundColor: "#22C55E" }]}
                    />
                    <Text style={styles.legendText}>
                      Days Present: <Text style={styles.legendValue}>18</Text>
                    </Text>
                  </View>
                  <View style={styles.legendItem}>
                    <View
                      style={[styles.legendDot, { backgroundColor: "#EF4444" }]}
                    />
                    <Text style={styles.legendText}>
                      Days Absent: <Text style={styles.legendValue}>2</Text>
                    </Text>
                  </View>
                </View>
              </View>
              {/* Pie Chart Placeholder */}
              <View
                style={[
                  styles.chartPlaceholder,
                  { backgroundColor: "#22C55E" },
                ]}
              >
                <View style={styles.chartInner} />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Table Section */}
      {/* Table */}
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
            <Text
              style={[styles.tableCell, styles.tableHeader, { width: 120 }]}
            >
              Name
            </Text>
            <Text
              style={[styles.tableCell, styles.tableHeader, { width: 100 }]}
            >
              School
            </Text>
            <Text
              style={[styles.tableCell, styles.tableHeader, { width: 100 }]}
            >
              Time In (AM)
            </Text>
            <Text
              style={[styles.tableCell, styles.tableHeader, { width: 110 }]}
            >
              Time Out (AM)
            </Text>
            <Text
              style={[styles.tableCell, styles.tableHeader, { width: 100 }]}
            >
              Time In (PM)
            </Text>
            <Text
              style={[styles.tableCell, styles.tableHeader, { width: 110 }]}
            >
              Time Out (PM)
            </Text>
            <Text style={[styles.tableCell, styles.tableHeader, { width: 90 }]}>
              Date
            </Text>
          </View>

          {/* Table Rows */}
          {paginatedData.map((item, index) => (
            <View
              key={index}
              style={[styles.tableRow, index % 2 === 0 && styles.tableRowAlt]}
            >
              <Text style={[styles.tableCell, { width: 50 }]}>{item.id}</Text>
              <Text style={[styles.tableCell, { width: 120 }]}>
                {item.name}
              </Text>
              <Text style={[styles.tableCell, { width: 100 }]}>
                {item.school}
              </Text>
              <Text style={[styles.tableCell, { width: 100 }]}>
                {item.timeInAM}
              </Text>
              <Text style={[styles.tableCell, { width: 110 }]}>
                {item.timeOutAM}
              </Text>
              <Text style={[styles.tableCell, { width: 100 }]}>
                {item.timeInPM}
              </Text>
              <Text style={[styles.tableCell, { width: 110 }]}>
                {item.timeOutPM}
              </Text>
              <Text style={[styles.tableCell, { width: 90 }]}>{item.date}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Pagination Controls */}
      <View style={styles.paginationContainer}>
        <Pressable
          style={[
            styles.paginationButton,
            currentPage === 1 && styles.paginationButtonDisabled,
          ]}
          onPress={handlePreviousPage}
          disabled={currentPage === 1}
        >
          <Text style={styles.paginationButtonText}>Previous</Text>
        </Pressable>
        <Pressable
          style={[
            styles.paginationButton,
            currentPage === totalPages && styles.paginationButtonDisabled,
          ]}
          onPress={handleNextPage}
          disabled={currentPage === totalPages}
        >
          <Text style={styles.paginationButtonText}>Next</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fafafaff",
    padding: 16,
  },
  cardsScrollView: {
    marginBottom: 24,
  },
  cardsContainer: {
    flexDirection: "row",
    gap: 16,
    paddingRight: 16,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    padding: 16,
    minWidth: width - 80,
  },
  cardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  cardLeft: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4B5563",
    marginBottom: 16,
  },
  legendContainer: {
    gap: 12,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontSize: 12,
    color: "#374151",
  },
  legendValue: {
    fontWeight: "600",
  },
  cardDivider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 16,
  },
  monthText: {
    fontSize: 12,
    color: "#4B5563",
  },
  monthValue: {
    fontWeight: "700",
    color: "#111827",
  },
  chartPlaceholder: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#EF4444",
    justifyContent: "center",
    alignItems: "center",
  },
  chartInner: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#FFFFFF",
  },
  tableSection: {
    gap: 16,
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 2,
  },
  filterLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 4,
    width: 100,
    height: 60,
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  picker: {
    height: 60,
    width: 100,
  },
  pickerItem: {
    fontSize: 14,
    color: "#111827",
  },
  pageInfo: {
    fontSize: 14,
    color: "#4B5563",
  },
  tableScroll: {
    borderRadius: 4,
    overflow: "hidden",
  },
  table: {
    backgroundColor: "#FFFFFF",
    borderRadius: 4,
    overflow: "hidden",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  tableRowAlt: {
    backgroundColor: "#F9FAFB",
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
    borderRightWidth: 1,
    borderRightColor: "#E5E7EB",
  },
  paginationContainer: {
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
  },
  paginationButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#FF8C00",
    borderRadius: 4,
  },
  paginationButtonDisabled: {
    backgroundColor: "#D1D5DB",
  },
  paginationButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 14,
  },
});

export default DTRStats;
