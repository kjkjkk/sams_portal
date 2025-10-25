import { Ionicons } from "@expo/vector-icons";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import StatCard from "./stat-card";

// SA HOME

const StatisticsCards = ({ cards }) => {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Ionicons name="home" size={24} color="#000" />
        <Text style={styles.sectionTitle}>HOME</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.horizontalScroll}
        contentContainerStyle={styles.horizontalContent}
      >
        {cards && cards.length > 0 ? (
          cards.map((card) => (
            <StatCard
              key={card.id}
              title={card.title}
              chartData={card.chartData}
              chartColors={card.chartColors}
              subtitle={card.subtitle}
              count={card.count}
            />
          ))
        ) : (
          <Text>No member stats available</Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  horizontalScroll: {
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  horizontalContent: {
    gap: 12,
  },
});

export default StatisticsCards;
