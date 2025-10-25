import { StyleSheet, Text, View } from "react-native";
import Svg, { Path } from "react-native-svg";

// SA HOME

const StatCard = ({ title, chartData, chartColors, subtitle, count }) => {
  const isValidChartData =
    chartData &&
    chartData.datasets &&
    Array.isArray(chartData.datasets) &&
    chartData.datasets.length > 0 &&
    chartData.datasets[0].data &&
    Array.isArray(chartData.datasets[0].data) &&
    chartData.datasets[0].data.length > 0;

  const data = isValidChartData ? chartData.datasets[0].data : [];
  const total = data.reduce((sum, val) => sum + val, 0);

  const generatePieSlices = () => {
    let currentAngle = -90; // Start from top
    const radius = 45;
    const centerX = 50;
    const centerY = 50;

    return data.map((value, idx) => {
      const sliceAngle = (value / total) * 360;
      const startAngle = currentAngle;
      const endAngle = currentAngle + sliceAngle;

      // Convert angles to radians
      const startRad = (startAngle * Math.PI) / 180;
      const endRad = (endAngle * Math.PI) / 180;

      // Calculate path points
      const x1 = centerX + radius * Math.cos(startRad);
      const y1 = centerY + radius * Math.sin(startRad);
      const x2 = centerX + radius * Math.cos(endRad);
      const y2 = centerY + radius * Math.sin(endRad);

      // Determine if arc is large (> 180 degrees)
      const largeArc = sliceAngle > 180 ? 1 : 0;

      // Create SVG path for pie slice
      const pathData = `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;

      currentAngle = endAngle;

      return {
        path: pathData,
        color: chartColors?.[idx] || "#ccc",
        value,
      };
    });
  };

  const pieSlices = isValidChartData ? generatePieSlices() : [];

  return (
    <View style={styles.statCard}>
      <Text style={styles.cardTitle}>{title}</Text>

      {isValidChartData && (
        <>
          <View style={styles.chartContainer}>
            <Svg width={120} height={120} viewBox="0 0 100 100">
              {pieSlices.map((slice, idx) => (
                <Path key={idx} d={slice.path} fill={slice.color} />
              ))}
            </Svg>
          </View>

          {chartData.labels && (
            <View style={styles.legend}>
              {chartData.labels.map((label, idx) => (
                <View key={idx} style={styles.legendItem}>
                  <View
                    style={[
                      styles.legendColor,
                      { backgroundColor: chartColors?.[idx] || "#ccc" },
                    ]}
                  />
                  <Text style={styles.legendText}>{label}</Text>
                </View>
              ))}
            </View>
          )}
        </>
      )}

      {subtitle && <Text style={styles.cardSubtitle}>{subtitle}</Text>}
      {count && (
        <Text style={styles.cardCount}>Total Registered Members: {count}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  statCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    width: 180,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
    marginBottom: 8,
  },
  chartContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 8,
  },
  legend: {
    marginTop: 8,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 2,
  },
  legendText: {
    fontSize: 12,
    color: "#666",
  },
  cardSubtitle: {
    fontSize: 12,
    color: "#666",
    marginTop: 8,
  },
  cardCount: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FF8C00",
    marginTop: 8,
  },
});

export default StatCard;
