import { Ionicons } from "@expo/vector-icons";
import { Image, StyleSheet, Text, View } from "react-native";

const Header = ({ searchQuery, setSearchQuery }) => {
  return (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        <Text style={styles.welcomeText}>Welcome to INFINITLMS</Text>
        <View style={styles.userSection}>
          <Image
            source={require("@/assets/images/Imageicn.png")}
            style={styles.userAvatar}
          />
          <Text style={styles.userName}>Whang D. Oda</Text>
        </View>
      </View>
      <View style={styles.logoSection}>
        <Ionicons name="bulb" size={48} color="#FF9500" />
        <Text style={styles.logoText}>INFINIT LMS</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  headerContent: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000",
    marginBottom: 12,
    letterSpacing: -0.5,
  },

  userSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  userAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  userName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
  },
  logoSection: {
    alignItems: "center",
    gap: 6,
  },
  logoText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#666",
    letterSpacing: 0.5,
  },
});

export default Header;
