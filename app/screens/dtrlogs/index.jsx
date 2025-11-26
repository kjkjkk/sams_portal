import DTRLog from "@/components/DTRScreen/DTRLog";
import BottomNavigation from "@/components/layout/bottom-navigation";
import Header from "@/components/layout/header";
import { useAuth } from "@/contexts/AuthContexts";
import dtrLogStyles from "@/styles/appScreenStyles/dtrLogStyles";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView, ScrollView, Text, View } from "react-native";

const dtrLogs = () => {
  const { user, getUserFullName } = useAuth();
  const fullName = getUserFullName();

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
                  // marginBottom: 18,
                }}
              >
                <Ionicons name="time-sharp" size={36} color="#000" />
                <Text
                  style={{ fontSize: 18, fontWeight: "bold", marginLeft: 8 }}
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
