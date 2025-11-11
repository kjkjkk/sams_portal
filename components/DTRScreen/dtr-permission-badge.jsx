/**
 * Visual indicator showing what DTR data the user can access
 * Optional component to display user's DTR access level
 */

import { isAdminUser } from "@/utils/roleUtils";
import { StyleSheet, Text, View } from "react-native";

const DTRPermissionBadge = ({ usrType }) => {
  const isAdmin = isAdminUser(usrType);

  return (
    <View
      style={[styles.badge, isAdmin ? styles.adminBadge : styles.studentBadge]}
    >
      <Text
        style={[
          styles.badgeText,
          isAdmin ? styles.adminText : styles.studentText,
        ]}
      >
        {isAdmin ? "📊 Admin: All DTR Records" : "👤 Student: Your DTR Only"}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginVertical: 10,
    alignItems: "center",
  },
  adminBadge: {
    backgroundColor: "#FEE2E2",
  },
  studentBadge: {
    backgroundColor: "#DBEAFE",
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  adminText: {
    color: "#991B1B",
  },
  studentText: {
    color: "#1E40AF",
  },
});

export default DTRPermissionBadge;
