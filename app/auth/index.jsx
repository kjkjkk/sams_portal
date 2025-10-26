"use client";

import Logo1 from "@/assets/images/Logo1.png";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import loginStyles from "../../styles/loginStyles";

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = () => {
    if (username && password) {
      router.push("/home");
    }
  };

  return (
    <ScrollView
      style={loginStyles.container}
      contentContainerStyle={loginStyles.contentContainer}
    >
      {/* Header Section */}
      <View style={loginStyles.headerSection}>
        {/* Logo */}
        <Image source={Logo1} style={loginStyles.logo} />
        {/* Logo Text */}
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
        {/* Username Field */}
        <View style={loginStyles.fieldContainer}>
          <Text style={loginStyles.label}>Username</Text>
          <TextInput
            style={loginStyles.input}
            placeholder="Enter your username"
            value={username}
            onChangeText={setUsername}
            placeholderTextColor="#999"
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
          />
        </View>

        {/* Login Button */}
        <TouchableOpacity style={loginStyles.loginButton} onPress={handleLogin}>
          <Ionicons name="log-in" size={20} color="white" />
          <Text style={loginStyles.loginButtonText}>Login</Text>
        </TouchableOpacity>

        {/* Forgot Password Link */}
        <TouchableOpacity>
          <Text style={loginStyles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>

        {/* Social Login Buttons */}
        <TouchableOpacity style={loginStyles.socialButton}>
          <Ionicons name="logo-google" size={24} color="#4285F4" />
          <Text style={loginStyles.socialButtonText}>Sign in with Google</Text>
        </TouchableOpacity>

        <TouchableOpacity style={loginStyles.socialButton}>
          <Ionicons name="logo-facebook" size={24} color="#1877F2" />
          <Text style={loginStyles.socialButtonText}>
            Sign in with Facebook
          </Text>
        </TouchableOpacity>

        {/* Footer Text */}
        <Text style={loginStyles.footerText}>
          © 2023 Advance Infinit Technology Solution Inc.
        </Text>
      </View>
    </ScrollView>
  );
}
