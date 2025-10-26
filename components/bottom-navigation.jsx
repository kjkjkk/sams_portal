import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Platform, StyleSheet, TouchableOpacity, View } from "react-native";

const BottomNavigation = () => {
  const router = useRouter();

  return (
    <View style={styles.bottomNav}>
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => router.push("/home")}
      >
        <Ionicons name="home" size={24} color="#fff" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navItem}
        onPress={() => router.push("/news")}
      >
        <Ionicons name="list" size={24} color="#fff" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navItem}
        onPress={() => router.push("/dtr")}
      >
        <Ionicons name="time" size={24} color="#fff" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navItem}
        onPress={() => router.push("/dtrlogs")}
      >
        <Ionicons name="folder" size={24} color="#fff" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.navItem}>
        <Ionicons name="menu" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomNav: {
    position: "absolute", // ✅ makes it sticky/fixed
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    backgroundColor: "#2a2a2a",
    paddingVertical: 12,
    justifyContent: "space-around",
    alignItems: "center",

    // ✅ Add shadow for better appearance
    borderTopWidth: 1,
    borderTopColor: "#444",
    elevation: 10, // Android shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,

    // ✅ Avoid overlap with safe areas on iOS
    paddingBottom: Platform.OS === "ios" ? 20 : 12,
  },
  navItem: {
    padding: 8,
  },
});

export default BottomNavigation;
