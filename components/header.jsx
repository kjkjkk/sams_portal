import Imageicn from "@/assets/images/Imageicn.png";
import { Ionicons } from "@expo/vector-icons";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const Header = ({ searchQuery, setSearchQuery }) => {
  return (
    <View style={styles.header}>
      <Text style={styles.welcomeText}>
        Welcome to <Text style={styles.infinitText}>INFINIT</Text>
        <Text style={styles.lmsText}>LMS</Text>
      </Text>

      <View style={styles.profileSection}>
        <Image source={Imageicn} style={styles.avatar} />
        <View style={styles.userInfo}>
          <Text style={styles.userName}>Whang D. Oda</Text>
        </View>
        <TouchableOpacity style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#999" />
          <Text style={styles.searchPlaceholder}>Search</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 40,
    paddingBottom: 12,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 12,
  },
  infinitText: {
    color: "#000",
  },
  lmsText: {
    color: "#FF8C00",
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  searchPlaceholder: {
    color: "#999",
    fontSize: 14,
  },
});

export default Header;
