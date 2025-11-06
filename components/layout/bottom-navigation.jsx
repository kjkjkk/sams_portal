// BottomNavigation.js

"use client";

import { useAuth } from "@/contexts/AuthContexts";
import { isAdminUser } from "@/utils/roleUtils";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Platform, StyleSheet, TouchableOpacity, View } from "react-native";

const BottomNavigation = () => {
  const router = useRouter();
  const { logout, user } = useAuth();
  const isAdmin = isAdminUser(user?.usrType);

  // --- New function to handle DTR navigation based on role ---
  const handleDtrNavigation = () => {
    if (isAdmin) {
      // Admin goes to the main DTR screen (e.g., DTR Table)
      router.push("/screens/dtr");
    } else {
      // Non-admin (regular user) goes to their DTR logs
      router.push("/screens/dtrlogs"); // Assuming you have a 'dtrlogs' screen for regular users
    }
  };
  // ------------------------------------------------------------

  return (
    <View style={styles.bottomNav}>
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => router.push("/screens/home")}
      >
        <Ionicons name="home" size={24} color="#fff" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navItem}
        onPress={() => router.push("/screens/news")}
      >
        <Ionicons name="list" size={24} color="#fff" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navItem}
        // --- Use the new handler here ---
        onPress={handleDtrNavigation}
        // The 'title' prop is not used in a regular <TouchableOpacity>,
        // but I'll keep the logic to decide the icon/label if you add one later.
        // For now, it doesn't affect the navigation itself.
        title={isAdmin ? "DTR Table (Admin)" : "My DTR Logs"}
      >
        <Ionicons name="time" size={24} color="#fff" />
      </TouchableOpacity>
      {/* ... rest of the navigation items */}
      <TouchableOpacity style={styles.navItem}>
        <Ionicons name="folder" size={24} color="#fff" />
      </TouchableOpacity>

      {/* Menu button logs out for now */}
      <TouchableOpacity style={styles.navItem} onPress={logout}>
        <Ionicons name="menu" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  // ... (styles remain the same)
  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    backgroundColor: "#2a2a2a",
    paddingVertical: 12,
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#444",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    paddingBottom: Platform.OS === "ios" ? 20 : 12,
  },
  navItem: {
    padding: 8,
  },
});

export default BottomNavigation;
