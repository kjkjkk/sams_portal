"use client";

import { useAuth } from "@/contexts/AuthContexts";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef } from "react";
import {
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";

export default function SlidingSettingsPanel({
  isVisible,
  onClose,
  headerHeight = 165,
  bottomHeight = 73,
}) {
  const { logout } = useAuth();
  const slideAnim = useRef(new Animated.Value(330)).current;
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  const panelHeight = screenHeight - headerHeight - bottomHeight;

  useEffect(() => {
    if (isVisible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 330,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isVisible, slideAnim]);

  const handleLogout = () => {
    onClose();
    logout();
  };

  if (!isVisible) return null;

  return (
    <View style={styles.container}>
      {/* Semi-transparent overlay behind panel */}
      <TouchableOpacity
        style={styles.overlay}
        onPress={onClose}
        activeOpacity={1}
      />

      <Animated.View
        style={[
          styles.panelContainer,
          {
            transform: [{ translateX: slideAnim }],
            top: headerHeight,
            height: panelHeight,
          },
        ]}
      >
        {/* Dark bar (left side) - contains close button */}
        <View style={styles.darkBar}>
          {/* Close button - positioned at top of dark bar */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* White content panel (right side) */}
        {/* <View style={styles.darkPanel}> */}
        <View style={styles.whitePanel}>
          {/* Header title section */}
          <View style={styles.titleContainer}>
            <Text style={styles.headerTitle}>LMS General Settings</Text>
          </View>

          {/* Scrollable content area */}
          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
          >
            {/* Account Section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="person" size={20} color="#2a2a2a" />
                <Text style={styles.sectionTitle}>Account</Text>
              </View>
              <TouchableOpacity style={styles.menuItem}>
                <Text style={styles.menuItemText}>• Personal Information</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem}>
                <Text style={styles.menuItemText}>• Account Settings</Text>
              </TouchableOpacity>
              <View style={styles.divider} />
            </View>

            {/* Messages Section */}
            <View style={styles.section}>
              <TouchableOpacity style={styles.sectionHeaderExpandable}>
                <View style={styles.sectionHeaderContent}>
                  <Ionicons name="mail" size={20} color="#2a2a2a" />
                  <Text style={styles.sectionTitle}>Messages</Text>
                </View>
                <Ionicons name="chevron-down" size={20} color="#2a2a2a" />
              </TouchableOpacity>
              <View style={styles.divider} />
            </View>

            {/* Pinned Courses Section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="star" size={20} color="#2a2a2a" />
                <Text style={styles.sectionTitle}>Pinned Courses</Text>
              </View>
              <View style={styles.divider} />
            </View>

            {/* Report Card Section */}
            <View style={styles.section}>
              <TouchableOpacity style={styles.sectionHeaderExpandable}>
                <View style={styles.sectionHeaderContent}>
                  <Ionicons name="document" size={20} color="#2a2a2a" />
                  <Text style={styles.sectionTitle}>Report Card</Text>
                </View>
                <Ionicons name="chevron-down" size={20} color="#2a2a2a" />
              </TouchableOpacity>
              <View style={styles.divider} />
            </View>

            {/* Spacer pushes logout to bottom */}
            <View style={styles.spacer} />
          </ScrollView>

          {/* Logout button - fixed at bottom */}
          <View style={styles.logoutContainer}>
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}
            >
              <Ionicons name="log-out" size={20} color="#2a2a2a" />
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* </View> */}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  panelContainer: {
    position: "absolute",
    right: 0,
    flexDirection: "row",
    width: 330,
  },
  darkBar: {
    width: 38,
    height: 38,
    backgroundColor: "#2a2a2a",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 12,
    // Custom corner rounding:
    borderTopLeftRadius: 15,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 0,
  },
  closeButton: {
    width: 24,
    height: 24,
    marginTop: -5,
    borderRadius: 22,
    backgroundColor: "#1a1a1a",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#fff",
  },
  whitePanel: {
    flex: 1,
    backgroundColor: "#2a2a2a",
    flexDirection: "column",
    // marginTop: 20,
    // marginLeft: 20,
    paddingTop: 20,
    paddingLeft: 20,
  },
  titleContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: "#f5f5f5",
    borderTopLeftRadius: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    alignItems: "center",
    color: "#2a2a2a",
  },
  scrollView: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#f5f5f5",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  sectionHeaderExpandable: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionHeaderContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2a2a2a",
    marginLeft: 12,
  },
  divider: {
    height: 1,
    backgroundColor: "#ddd",
    marginTop: 10,
  },
  menuItem: {
    paddingVertical: 8,
    paddingLeft: 5,
  },
  menuItemText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  spacer: {
    flex: 1,
  },
  logoutContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#f5f5f5",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2a2a2a",
    marginLeft: 12,
  },
});
