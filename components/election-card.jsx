import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

// SA HOME

const ElectionCard = ({ card }) => {
  return (
    <View style={styles.electionCard}>
      <View style={styles.electionHeader}>
        <Text style={styles.electionTitle}>{card.title}</Text>
      </View>
      <View style={styles.electionContent}>
        <View style={styles.eventInfo}>
          <Text style={styles.eventLabel}>{card.event}</Text>
          <Text style={styles.eventDate}>{card.date}</Text>
        </View>
        <Text style={styles.eventDescription}>{card.description}</Text>
        <Text style={styles.eventDetails}>
          {card.details}
          {""}
          <TouchableOpacity>
            <Text style={styles.hereLink}>here!</Text>
          </TouchableOpacity>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  electionCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  electionHeader: {
    backgroundColor: "#E63946",
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  electionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },
  electionContent: {
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  eventInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  eventLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FF8C00",
  },
  eventDate: {
    fontSize: 12,
    color: "#666",
  },
  eventDescription: {
    fontSize: 13,
    fontWeight: "600",
    color: "#000",
    marginBottom: 4,
  },
  eventDetails: {
    fontSize: 12,
    color: "#666",
    lineHeight: 18,
    marginBottom: 4,
  },
  hereLink: {
    fontSize: 12,
    color: "#FF8C00",
    fontWeight: "600",
    textDecorationLine: "underline",
  },
});

export default ElectionCard;
