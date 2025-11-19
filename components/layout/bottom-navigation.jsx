"use client";

import SlidingSettingsPanel from "@/components/SlidingSettingsPanel";
import { useAuth } from "@/contexts/AuthContexts";
// import bottomNavStyles from "@/styles/layoutStyles/bottom-navigation";
import { useTheme } from "@/contexts/ThemeContext"; // Add this import
import { isAdminUser } from "@/utils/roleUtils";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Platform, StyleSheet, TouchableOpacity, View } from "react-native";

const BottomNavigation = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { theme } = useTheme(); // Add this line
  const isAdmin = isAdminUser(user?.usrType);
  const [isSettingsPanelVisible, setIsSettingsPanelVisible] = useState(false);

  // Create dynamic styles based on theme
  const bottomNavStyles = useMemo(() => createStyles(theme), [theme]); // Add this line

  const handleDtrNavigation = () => {
    if (isAdmin) {
      router.push("/screens/dtr");
    } else {
      router.push("/screens/dtrlogs");
    }
  };

  return (
    <>
      <SlidingSettingsPanel
        isVisible={isSettingsPanelVisible}
        onClose={() => setIsSettingsPanelVisible(false)}
      />

      <View style={bottomNavStyles.bottomNav}>
        <TouchableOpacity
          style={bottomNavStyles.navItem}
          onPress={() => router.push("/screens/home")}
        >
          <Ionicons name="home" size={24} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity
          style={bottomNavStyles.navItem}
          onPress={() => router.push("/screens/news")}
        >
          <Ionicons name="folder" size={24} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity
          style={bottomNavStyles.navItem}
          onPress={handleDtrNavigation}
          title={isAdmin ? "DTR Table (Admin)" : "My DTR Logs"}
        >
          <Ionicons name="time" size={24} color="#fff" />
        </TouchableOpacity>

        {/* <TouchableOpacity style={bottomNavStyles.navItem}>
          <Ionicons name="folder" size={24} color="#fff" />
        </TouchableOpacity> */}

        <TouchableOpacity
          style={bottomNavStyles.navItem}
          onPress={() => setIsSettingsPanelVisible(true)}
        >
          <Ionicons name="menu" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </>
  );
};

const createStyles = (theme) =>
  StyleSheet.create({
    bottomNav: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      flexDirection: "row",
      backgroundColor: theme.footer, // Dynamic theme color
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
