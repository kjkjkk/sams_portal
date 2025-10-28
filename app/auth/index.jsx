"use client";

import Logo1 from "@/assets/images/Logo1.png";
import { config, database } from "@/services/appwrite";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
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
import { Query } from "react-native-appwrite";
import loginStyles from "../../styles/loginStyles";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    // Validation
    if (!email.trim() || !password.trim()) {
      Alert.alert("Error", "Email and password are required");
      return;
    }

    setLoading(true);

    try {
      // Query your samps_pt table for the user
      const response = await database.listDocuments(
        config.databaseId,
        config.collections.users,
        [Query.equal("email", email.trim().toLowerCase())]
      );

      console.log("Query response:", response);

      if (response.documents.length === 0) {
        Alert.alert("Login Failed", "User not found");
        setLoading(false);
        return;
      }

      const user = response.documents[0];

      // Check password (plaintext comparison - see security note below)
      if (user.password === password) {
        console.log("Login successful:", user);

        // Store user data (you might want to use AsyncStorage here)
        // await AsyncStorage.setItem('user', JSON.stringify(user));

        // Navigate to home
        router.replace("/home");
      } else {
        Alert.alert("Login Failed", "Incorrect password");
      }
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert(
        "Login Failed",
        error.message || "An error occurred. Please try again."
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

      {/* Login Prompt */}
      <View style={loginStyles.promptSection}>
        <Text style={loginStyles.promptText}>Please login to continue</Text>
      </View>

      {/* Form Section */}
      <View style={loginStyles.formSection}>
        {/* Email Field */}
        <View style={loginStyles.fieldContainer}>
          <Text style={loginStyles.label}>Email</Text>
          <TextInput
            style={loginStyles.input}
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            placeholderTextColor="#999"
            keyboardType="email-address"
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

        {/* Login Button */}
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

        {/* Forgot Password Link */}
        <TouchableOpacity disabled={loading}>
          <Text style={loginStyles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>

        {/* Social Login Buttons */}
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

        {/* Footer Text */}
        <Text style={loginStyles.footerText}>
          © 2025 Advance Infinit Technology Solution Inc.
        </Text>
      </View>
    </ScrollView>
  );
}
