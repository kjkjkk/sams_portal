import { ScrollView, StyleSheet, Text, View } from "react-native";
import ElectionCard from "./election-card";

// SA HOME

const ElectionProcessResult = ({ cards }) => {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Election Process Result</Text>

      <ScrollView
        style={styles.electionList}
        scrollEnabled={true}
        showsVerticalScrollIndicator={false}
      >
        {cards && cards.length > 0 ? (
          cards.map((card) => <ElectionCard key={card.id} card={card} />)
        ) : (
          <Text>No election results available</Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 12,
  },
  electionList: {
    maxHeight: 400,
  },
});

export default ElectionProcessResult;
