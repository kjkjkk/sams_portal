import Logo1 from "@/assets/images/Logo1.png";
import { useAuth } from "@/contexts/AuthContexts";
import loginStyles from "@/styles/appScreenStyles/loginStyles";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // ✅ Added error state
  const router = useRouter();
  const { login, user, isAuthenticated, loading: authLoading } = useAuth();

  // ✅ Debug: Log auth state changes
  useEffect(() => {
    console.log("[Login] Auth State:", {
      isAuthenticated,
      user: user
        ? {
            usrID: user.usrID,
            usrType: user.usrType,
            accID: user.accID,
            name: `${user.usrFirstName} ${user.usrLastName}`,
          }
        : null,
      authLoading,
    });
  }, [isAuthenticated, user, authLoading]);

  useEffect(() => {
    // ✅ Fixed: Check for usrID instead of id
    if (isAuthenticated && user?.usrID) {
      console.log("[Login] User authenticated, redirecting to home");
      console.log("[Login] User details:", {
        usrID: user.usrID,
        accID: user.accID,
        usrType: user.usrType,
      });
      router.replace("/screens/home");
    }
  }, [isAuthenticated, user, router]);

  const handleLogin = async () => {
    // ✅ Clear previous errors
    setError(null);

    // ✅ Input validation with detailed messages
    if (!username.trim()) {
      const errorMsg = "Username is required";
      setError(errorMsg);
      Alert.alert("Validation Error", errorMsg);
      console.log("[Login] Validation failed: Username empty");
      return;
    }

    if (!password.trim()) {
      const errorMsg = "Password is required";
      setError(errorMsg);
      Alert.alert("Validation Error", errorMsg);
      console.log("[Login] Validation failed: Password empty");
      return;
    }

    setLoading(true);
    console.log("[Login] ===== Login Attempt Started =====");
    console.log("[Login] Username:", username.trim());

    try {
      console.log("[Login] Calling login function...");
      const result = await login(username.trim(), password);

      console.log("[Login] Login function returned:", result);
      console.log("[Login] ===== Login Successful =====");

      // ✅ Wait a bit for auth state to update
      setTimeout(() => {
        console.log("[Login] Navigating to home...");
        router.replace("/screens/home");
      }, 100);
    } catch (error) {
      console.error("[Login] ===== Login Error =====");
      console.error("[Login] Error object:", error);
      console.error("[Login] Error message:", error.message);
      console.error("[Login] Error stack:", error.stack);

      // ✅ Determine error type and show appropriate message
      let errorMessage = "An unexpected error occurred. Please try again.";

      if (error.message) {
        errorMessage = error.message;
      } else if (error.response) {
        // API error response
        console.error("[Login] API Response:", error.response);
        errorMessage = error.response.data?.message || "Server error occurred";
      } else if (error.request) {
        // Network error
        console.error("[Login] Network error:", error.request);
        errorMessage = "Network error. Please check your connection.";
      }

      setError(errorMessage);
      Alert.alert("Login Failed", errorMessage);
    } finally {
      setLoading(false);
      console.log("[Login] ===== Login Attempt Ended =====");
    }
  };

  // ✅ Show loading indicator while checking auth
  if (authLoading) {
    return (
      <View
        style={[
          loginStyles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color="#FF8C00" />
        <Text style={{ marginTop: 10, color: "#666" }}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={loginStyles.container}
      contentContainerStyle={loginStyles.contentContainer}
    >
      {/* Header Section */}
      <View style={loginStyles.headerSection}>
        <Image source={Logo1} style={loginStyles.logo} />
        <View style={loginStyles.logoTextContainer}>
          <Text style={loginStyles.logoTextInfinit}>INFINIT</Text>
          <Text style={loginStyles.logoTextLms}>LMS</Text>
        </View>
      </View>

      <View style={loginStyles.promptSection}>
        <Text style={loginStyles.promptText}>Please login to continue</Text>
      </View>

      {/* ✅ Error Display */}
      {error && (
        <View
          style={{
            backgroundColor: "#FEE",
            padding: 12,
            borderRadius: 8,
            marginHorizontal: 20,
            marginBottom: 10,
            borderLeftWidth: 4,
            borderLeftColor: "#F00",
          }}
        >
          <Text style={{ color: "#C00", fontSize: 13 }}>⚠️ {error}</Text>
        </View>
      )}

      <View style={loginStyles.formSection}>
        {/* Username Field */}
        <View style={loginStyles.fieldContainer}>
          <Text style={loginStyles.label}>Username</Text>
          <TextInput
            style={loginStyles.input}
            placeholder="Enter your username"
            value={username}
            onChangeText={(text) => {
              setUsername(text);
              setError(null); // ✅ Clear error on input
            }}
            placeholderTextColor="#999"
            autoCapitalize="none"
            editable={!loading}
            returnKeyType="next"
          />
        </View>

        {/* Password Field */}
        <View style={loginStyles.fieldContainer}>
          <Text style={loginStyles.label}>Password</Text>
          <TextInput
            style={loginStyles.input}
            placeholder="Enter your password"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setError(null); // ✅ Clear error on input
            }}
            secureTextEntry
            placeholderTextColor="#999"
            editable={!loading}
            returnKeyType="done"
            onSubmitEditing={handleLogin}
          />
        </View>

        <TouchableOpacity
          style={[loginStyles.loginButton, loading && { opacity: 0.6 }]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <Ionicons name="log-in" size={20} color="white" />
              <Text style={loginStyles.loginButtonText}>Login</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity disabled={loading}>
          <Text style={loginStyles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={loginStyles.socialButton} disabled={loading}>
          <Ionicons name="logo-google" size={24} color="#4285F4" />
          <Text style={loginStyles.socialButtonText}>Sign in with Google</Text>
        </TouchableOpacity>

        <TouchableOpacity style={loginStyles.socialButton} disabled={loading}>
          <Ionicons name="logo-facebook" size={24} color="#1877F2" />
          <Text style={loginStyles.socialButtonText}>
            Sign in with Facebook
          </Text>
        </TouchableOpacity>

        <Text style={loginStyles.footerText}>
          © 2025 Advance Infinit Technology Solution Inc.
        </Text>
      </View>
    </ScrollView>
  );
}
