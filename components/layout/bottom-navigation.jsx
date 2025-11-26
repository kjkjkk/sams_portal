"use client";

import SlidingSettingsPanel from "@/components/SlidingSettingsPanel";
import { useAuth } from "@/contexts/AuthContexts";
import { useTheme } from "@/contexts/ThemeContext";
import { isLMSAdminUser, isSuperAdminUser } from "@/utils/roleUtils"; // ✅ Import both
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Platform, StyleSheet, TouchableOpacity, View } from "react-native";

const BottomNavigation = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { theme } = useTheme();
  const isSuperAdmin = isSuperAdminUser(user?.usrType);
  const isLMSAdmin = isLMSAdminUser(user?.usrType); // ✅ Check LMS Admin
  const [isSettingsPanelVisible, setIsSettingsPanelVisible] = useState(false);

  // Create dynamic styles based on theme
  const bottomNavStyles = useMemo(() => createStyles(theme), [theme]);

  // ✅ FIXED: Both Super Admin and LMS Admin can access DTR table
  const handleDtrNavigation = () => {
    if (isSuperAdmin || isLMSAdmin) {
      // ✅ Both go to DTR table
      router.push("/screens/dtr");
    } else {
      // ✅ Everyone else sees their own logs
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
          title={isSuperAdmin || isLMSAdmin ? "DTR Management" : "My DTR Logs"}
        >
          <Ionicons name="time" size={24} color="#fff" />
        </TouchableOpacity>

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
      backgroundColor: theme.footer,
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
