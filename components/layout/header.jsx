import { useAuth } from "@/contexts/AuthContexts";
import { useTheme } from "@/contexts/ThemeContext"; // Add this line
import ApiService from "@/services/api";
// import headerStyles from "@/styles/layoutStyles/header";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useMemo, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";

const Header = () => {
  const { user, getUserFullName } = useAuth();
  const [schoolData, setSchoolData] = useState(null);
  const { theme } = useTheme(); // Add this line
  const [loading, setLoading] = useState(false);

  const fullName = getUserFullName();

  useEffect(() => {
    const fetchSchoolData = async () => {
      if (!user?.accID) {
        console.log("[Header] No accID found, using default school");
        setSchoolData({ accName2: "INFINIT", accName: "INFINIT" });
        return;
      }

      try {
        setLoading(true);
        console.log("[Header] Fetching school for accID:", user.accID);

        const response = await ApiService.getSchool(user.accID);

        if (response.success && response.data) {
          setSchoolData(response.data);
          console.log(
            "[Header] School loaded:",
            response.data.accName2 || response.data.accName
          );
        } else {
          console.log("[Header] No school data found");
          setSchoolData({ accName2: "INFINIT", accName: "INFINIT" });
        }
      } catch (err) {
        console.error("[Header] Failed to fetch school:", err);
        setSchoolData({ accName2: "INFINIT", accName: "INFINIT" });
      } finally {
        setLoading(false);
      }
    };

    fetchSchoolData();
  }, [user?.accID]);

  const getSchoolDisplayName = () => {
    if (loading) return "...";
    return schoolData?.accName2 || schoolData?.accName || "INFINIT";
  };

  const renderSchoolLogo = () => {
    const displayName = getSchoolDisplayName();

    if (displayName.toUpperCase() === "UM") {
      return (
        <Text style={headerStyles.logoText}>
          <Text style={{ color: "#D00000" }}>U</Text>
          <Text style={{ color: "#FFD000" }}>M </Text>
          LMS
        </Text>
      );
    }
    if (displayName.toUpperCase() === "INFINIT") {
      return (
        <Text style={headerStyles.logoText}>
          <Text style={{ color: "#171717ff" }}>INFIN</Text>
          <Text style={{ color: "#ff8400ff" }}>IT </Text>
          LMS
        </Text>
      );
    }

    return (
      <Text style={[headerStyles.logoText, { color: "#000" }]}>
        {displayName} LMS
      </Text>
    );
  };

  // Create dynamic styles based on theme - Add this section
  const headerStyles = useMemo(
    () =>
      StyleSheet.create({
        header: {
          flexDirection: "row",
          justifyContent: "space-between",
          backgroundColor: theme.content, // Dynamic
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
          color: theme.contentText, // Dynamic
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
          color: theme.contentText, // Dynamic
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
      }),
    [theme]
  );

  return (
    <View style={headerStyles.header}>
      <View style={headerStyles.headerContent}>
        <Text style={headerStyles.welcomeText}>
          Welcome to {getSchoolDisplayName()} LMS
        </Text>
        <View style={headerStyles.userSection}>
          {/* <Image
            source={
              user?.usrImage
                ? { uri: user.usrImage }
                : require("@/assets/images/Imageicn.png")
            }
            style={headerStyles.userAvatar}
          /> */}
          <Image
            source={require("@/assets/images/Imageicn.png")}
            style={headerStyles.userAvatar}
          />
          <Text style={headerStyles.userName}>{fullName}</Text>
        </View>
      </View>
      <View style={headerStyles.logoSection}>
        <Ionicons name="bulb" size={48} color="#FF9500" />
        {renderSchoolLogo()}
      </View>
    </View>
  );
};

const headerStyles = StyleSheet.create({
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
