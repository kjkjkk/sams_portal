import CategoryBadge from "@/components/NewsScreen/CategoryBadge";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
// SA NEWS

const NewsItem = ({ item }) => {
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate("NewsDetail", { item });
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.container}>
      <View style={styles.content}>
        <Image source={item.avatar} style={styles.avatar} />
        <View style={styles.textContent}>
          <View style={styles.badgeRow}>
            <CategoryBadge category={item.category} />
            <Text style={styles.title}>{item.title}</Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.author}>{item.author}</Text>
            <Text style={styles.dot}>•</Text>
            <Text style={styles.date}>{item.date}</Text>
          </View>
        </View>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="pencil-sharp" size={24} color="#4CAF50" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="trash" size={24} color="#FF5252" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    flexDirection: "row",
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  textContent: {
    flex: 1,
    justifyContent: "center",
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  title: {
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
    flex: 1,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  author: {
    fontSize: 12,
    fontWeight: "600",
    color: "#666",
  },
  dot: {
    fontSize: 12,
    color: "#999",
  },
  date: {
    fontSize: 12,
    color: "#999",
  },
  actions: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    padding: 4,
  },
});

export default NewsItem;
