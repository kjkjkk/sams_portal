import DTRLog from "@/components/DTRScreen/DTRLog";
import BottomNavigation from "@/components/layout/bottom-navigation";
import Header from "@/components/layout/header";
import dtrLogStyles from "@/styles/dtrLogStyles";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView, ScrollView, Text, View } from "react-native";

const dtrLogs = () => {
  return (
    <SafeAreaView style={dtrLogStyles.container}>
      <ScrollView
        style={dtrLogStyles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ flex: 1, backgroundColor: "white" }}>
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
                  <Text style={{ color: "#FF7700", fontSize: 18 }}>▶</Text>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "600",
                      color: "#1f2937",
                      marginLeft: 8,
                    }}
                  >
                    My DTR Entry Log
                  </Text>
                </View>
              </View>

              {/* Table */}
              <DTRLog />
            </View>
          </ScrollView>
        </View>
      </ScrollView>

      <BottomNavigation />
    </SafeAreaView>
  );
};

export default dtrLogs;
