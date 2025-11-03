import { useAuth } from "@/contexts/AuthContexts";
import { config, database } from "@/services/appwrite"; // ✅ to access Appwrite
import { Ionicons } from "@expo/vector-icons";
import { Query } from "appwrite";
import { useEffect, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";

const Header = () => {
  const { user } = useAuth();
  const [schoolName, setSchoolName] = useState("INFINIT LMS");
  const [schoolName2, setSchoolName2] = useState("INFINIT LMS");

  const fullName = user?.fullName || "Guest User";

  useEffect(() => {
    const fetchSchoolName = async () => {
      try {
        if (!user?.accID) return;

        const res = await database.listDocuments(
          config.databaseId,
          config.collections.schoolaccounts,
          [Query.equal("schoolid", user.accID)] // match user's school
        );

        if (res.documents.length > 0) {
          const school = res.documents[0];
          setSchoolName(school.accName || "Unknown School");
        }
      } catch (err) {
        console.error("[Header] Failed to fetch school name:", err);
      }
    };

    fetchSchoolName();
  }, [user?.accID]);

  useEffect(() => {
    const fetchSchoolName2 = async () => {
      try {
        if (!user?.accID) return;

        const res = await database.listDocuments(
          config.databaseId,
          config.collections.schoolaccounts,
          [Query.equal("schoolid", user.accID)] // match user's school
        );

        if (res.documents.length > 0) {
          const school = res.documents[0];
          setSchoolName2(school.accName2 || "Unknown School");
        }
      } catch (err) {
        console.error("[Header] Failed to fetch school name:", err);
      }
    };

    fetchSchoolName2();
  }, [user?.accID]);

  const renderSchoolName = () => {
    if (schoolName2.toUpperCase() === "UM") {
      return (
        <Text style={styles.welcomeText}>
          <Text style={{ color: "#D00000" }}>U</Text>
          <Text style={{ color: "#FFD000" }}>M </Text>
          LMS
        </Text>
      );
    }
    // Else, default color black
    return (
      <Text style={[styles.logoText, { color: "#000" }]}>
        {schoolName2} LMS
      </Text>
    );
  };

  return (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        <Text style={styles.welcomeText}>Welcome to {renderSchoolName()} </Text>
        <View style={styles.userSection}>
          <Image
            source={require("@/assets/images/Imageicn.png")}
            style={styles.userAvatar}
          />
          <Text style={styles.userName}>{fullName}</Text>
        </View>
      </View>
      <View style={styles.logoSection}>
        <Ionicons name="bulb" size={48} color="#FF9500" />
        {/* <Text style={styles.logoText}>{schoolName}</Text> */}
        {renderSchoolName()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fafafaff",
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
    gap: 2,
  },
  logoText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#666",
    letterSpacing: 0.5,
  },
});

export default Header;
