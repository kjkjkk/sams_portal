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
  const [username, setUsername] = useState(""); // Changed from email
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login, user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      // Changed from stdId to id
      console.log("[Login] User already authenticated, redirecting to home");
      router.replace("/screens/home");
    }
  }, [isAuthenticated, user, router]);

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert("Error", "Username and password are required");
      return;
    }

    setLoading(true);

    try {
      await login(username.trim(), password); // Removed toLowerCase() unless needed
      console.log("[Login] Login successful, navigating to home");
      router.replace("/screens/home");
    } catch (error) {
      console.error("[Login] Login error:", error);
      Alert.alert(
        "Login Failed",
        error.message || "Invalid username or password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

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

      <View style={loginStyles.formSection}>
        {/* Username Field */}
        <View style={loginStyles.fieldContainer}>
          <Text style={loginStyles.label}>Username</Text>
          <TextInput
            style={loginStyles.input}
            placeholder="Enter your username"
            value={username}
            onChangeText={setUsername}
            placeholderTextColor="#999"
            autoCapitalize="none"
            editable={!loading}
          />
        </View>

        {/* Password Field */}
        <View style={loginStyles.fieldContainer}>
          <Text style={loginStyles.label}>Password</Text>
          <TextInput
            style={loginStyles.input}
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor="#999"
            editable={!loading}
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
