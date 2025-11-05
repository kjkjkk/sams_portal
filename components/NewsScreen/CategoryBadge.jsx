import { StyleSheet, Text, View } from "react-native";

// SA HOME

const CategoryBadge = ({ category }) => {
  const getBadgeStyle = (cat) => {
    switch (cat) {
      case "News":
        return { backgroundColor: "#FF3B30", color: "#fff" };
      case "Announcement":
        return { backgroundColor: "#FF2D55", color: "#fff" };
      case "Notice":
        return { backgroundColor: "#FF9500", color: "#fff" };
      case "Update":
        return { backgroundColor: "#007AFF", color: "#fff" };
      case "Event":
        return { backgroundColor: "#34C759", color: "#fff" };
      default:
        return { backgroundColor: "#999", color: "#fff" };
    }
  };

  const badgeStyle = getBadgeStyle(category);

  return (
    <View
      style={[styles.badge, { backgroundColor: badgeStyle.backgroundColor }]}
    >
      <Text style={[styles.badgeText, { color: badgeStyle.color }]}>
        {category}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "700",
  },
});

export default CategoryBadge;
