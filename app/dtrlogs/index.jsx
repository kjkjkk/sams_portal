import BottomNavigation from "@/components/bottom-navigation";
import DTRTable from "@/components/DTRLog";
import Header from "@/components/header";
import newStyles from "@/styles/newsStyles";
import { Ionicons } from "@expo/vector-icons";
// import { Clock } from "lucide-react";
import { SafeAreaView, ScrollView, Text, View } from "react-native";

const NewsDetailScreen = () => {
  return (
    <SafeAreaView style={newStyles.container}>
      <ScrollView
        style={newStyles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ flex: 1, backgroundColor: "white" }}>
          {/* Header Section */}
          {/* <View style={newStyles.header}>
            <View style={newStyles.headerContent}>
              <Text style={newStyles.welcomeText}>Welcome to INFINITLMS</Text>
              <View style={newStyles.userSection}>
                <Image
                  source={require("@/assets/images/Imageicn.png")}
                  style={newStyles.userAvatar}
                />
                <Text style={newStyles.userName}>Whang D. Oda</Text>
              </View>
            </View>
            <View style={newStyles.logoSection}>
              <Ionicons name="bulb" size={48} color="#FF9500" />
              <Text style={newStyles.logoText}>INFINIT LMS</Text>
            </View>
          </View> */}
          <Header />

          {/* Main Content */}
          <ScrollView
            style={{ flex: 1, paddingHorizontal: 24, paddingVertical: 16 }}
          >
            {/* Daily Time Record Section */}
            <View style={{ marginBottom: 32 }}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 24,
                }}
              >
                <Ionicons name="time-sharp" size={24} color="#333" />
                <Text
                  style={{ fontSize: 20, fontWeight: "bold", marginLeft: 8 }}
                >
                  Daily Time Record
                </Text>
                <View
                  style={{
                    flex: 1,
                    height: 1,
                    backgroundColor: "#ccc",
                    marginLeft: 16,
                  }}
                />
              </View>

              {/* My DTR Entry Log */}
              <View style={{ marginBottom: 16 }}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text style={{ color: "#0d9488", fontSize: 18 }}>▶</Text>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "600",
                      color: "#1f2937",
                      marginLeft: 8,
                    }}
                  >
                    Pinning Garcia Entry Log
                  </Text>
                </View>
              </View>

              {/* Table */}
              <DTRTable />
            </View>
          </ScrollView>
        </View>
      </ScrollView>

      <BottomNavigation />
    </SafeAreaView>
  );
};

export default NewsDetailScreen;
