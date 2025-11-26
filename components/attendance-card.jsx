import { StyleSheet, Text, View } from "react-native";
import { PieChart } from "react-native-chart-kit";

const AttendanceCard = ({
  daysPresent = 0,
  daysAbsent = 0,
  totalHours = "0",
  appliedFromDate,
  appliedToDate,
}) => {
  // DonutChart defined inside the component
  const DonutChart = () => {
    const total = daysPresent + daysAbsent;

    if (total === 0) {
      return (
        <View style={styles.chartContainer}>
          <Text style={styles.noDataText}>No data</Text>
        </View>
      );
    }

    const data = [
      {
        name: "Days Present",
        hours: daysPresent || 0.1,
        color: "#EF4444",
        legendFontColor: "#1F2937",
        legendFontSize: 14,
      },
      {
        name: "Days Absent",
        hours: daysAbsent || 0.1,
        color: "#FF8C00",
        legendFontColor: "#1F2937",
        legendFontSize: 14,
      },
    ];

    return (
      <View style={{ alignItems: "center", justifyContent: "center" }}>
        <PieChart
          data={data}
          width={90}
          height={90}
          paddingLeft="20"
          chartConfig={{
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          accessor="hours"
          backgroundColor="transparent"
          hasLegend={false}
        />
        <View
          style={{
            position: "absolute",
            width: 50,
            height: 50,
            borderRadius: 35,
            marginLeft: -5,
            backgroundColor: "white",
          }}
        />
      </View>
    );
  };

  return (
    <View style={styles.cardHorizontal}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>Attendance Summary</Text>
      </View>
      <View style={styles.cardContent}>
        {/* Left side - Legend */}
        <View style={styles.legendContainer}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: "#EF4444" }]} />
            <Text style={styles.legendLabel}>{daysPresent} Days Present</Text>
          </View>

          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: "#FF8C00" }]} />
            <Text style={styles.legendLabel}>{daysAbsent} Days Absent</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.totalSection}>
            <Text style={styles.totalLabel}>
              Total Hours{" "}
              {appliedFromDate || appliedToDate ? "in Range" : "of the Month"}:{" "}
              {totalHours}
            </Text>
          </View>
        </View>

        {/* Right side - Chart */}
        <DonutChart />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardHorizontal: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 10,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    minWidth: 300,
    width: 300,
  },
  cardHeader: {
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1F2937",
  },
  cardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  legendContainer: {
    flex: 1,
    minWidth: 180,
    paddingRight: 20,
    justifyContent: "center",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  legendDot: {
    width: 14,
    height: 14,
    borderRadius: 2,
    marginRight: 8,
  },
  legendLabel: {
    fontSize: 11,
    color: "#6B7280",
    lineHeight: 14,
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 12,
  },
  totalSection: {
    marginTop: 4,
  },
  totalLabel: {
    fontSize: 11,
    color: "#6B7280",
    fontWeight: "400",
  },
  chartContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: 90,
    height: 90,
  },
  noDataText: {
    fontSize: 12,
    color: "#999",
  },
});

export default AttendanceCard;
