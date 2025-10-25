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
import loginStyles from "../styles/loginStyles";

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

// const loginStyles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#2a2a2a",
//   },
//   contentContainer: {
//     paddingBottom: 20,
//   },
//   headerSection: {
//     backgroundColor: "#2a2a2a",
//     paddingVertical: 40,
//     alignItems: "center",
//   },
//   logo: {
//     height: 100,
//     width: 100,
//     marginTop: 50,
//     marginBottom: 20,
//     borderRadius: 10,
//   },
//   logoContainer: {
//     width: 100,
//     height: 100,
//     justifyContent: "center",
//     alignItems: "center",
//     marginBottom: 16,
//     position: "relative",
//   },
//   lightbulb: {
//     width: 60,
//     height: 70,
//     position: "relative",
//   },
//   bulbLeft: {
//     position: "absolute",
//     left: 0,
//     top: 0,
//     width: 30,
//     height: 45,
//     backgroundColor: "#FF8C00",
//     borderTopLeftRadius: 30,
//     borderBottomLeftRadius: 30,
//   },
//   bulbRight: {
//     position: "absolute",
//     right: 0,
//     top: 0,
//     width: 30,
//     height: 45,
//     backgroundColor: "white",
//     borderTopRightRadius: 30,
//     borderBottomRightRadius: 30,
//   },
//   bulbBase: {
//     position: "absolute",
//     bottom: 0,
//     left: "50%",
//     marginLeft: -10,
//     width: 20,
//     height: 12,
//     backgroundColor: "#FF8C00",
//     borderRadius: 2,
//   },
//   decorLine: {
//     position: "absolute",
//     backgroundColor: "#FF8C00",
//   },
//   decorLineTop: {
//     top: -15,
//     left: "50%",
//     marginLeft: -8,
//     width: 16,
//     height: 4,
//   },
//   decorLineRight: {
//     right: -15,
//     top: "50%",
//     marginTop: -8,
//     width: 4,
//     height: 16,
//   },
//   decorLineBottom: {
//     bottom: -15,
//     left: "50%",
//     marginLeft: -8,
//     width: 16,
//     height: 4,
//   },
//   decorLineLeft: {
//     left: -15,
//     top: "50%",
//     marginTop: -8,
//     width: 4,
//     height: 16,
//   },
//   logoTextContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   logoTextInfinit: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "white",
//     letterSpacing: 1,
//   },
//   logoTextLms: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "#FF8C00",
//     letterSpacing: 1,
//   },
//   promptSection: {
//     backgroundColor: "#2a2a2a",
//     paddingVertical: 20,
//     paddingHorizontal: 16,
//     alignItems: "center",
//   },
//   promptText: {
//     fontSize: 16,
//     fontWeight: "600",
//     color: "#FF8C00",
//   },
//   formSection: {
//     backgroundColor: "#FF8C00",
//     marginHorizontal: 16,
//     marginVertical: 16,
//     paddingHorizontal: 20,
//     paddingVertical: 24,
//     borderRadius: 20,
//   },
//   fieldContainer: {
//     marginBottom: 16,
//   },
//   label: {
//     fontSize: 14,
//     fontWeight: "600",
//     color: "#2a2a2a",
//     marginBottom: 8,
//   },
//   input: {
//     backgroundColor: "white",
//     borderRadius: 8,
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     fontSize: 14,
//     color: "#2a2a2a",
//   },
//   loginButton: {
//     backgroundColor: "#2a2a2a",
//     borderRadius: 8,
//     paddingVertical: 14,
//     flexDirection: "row",
//     justifyContent: "center",
//     alignItems: "center",
//     marginTop: 8,
//     marginBottom: 12,
//   },
//   loginButtonText: {
//     color: "white",
//     fontSize: 16,
//     fontWeight: "bold",
//     marginLeft: 8,
//   },
//   forgotPasswordText: {
//     color: "white",
//     fontSize: 14,
//     fontWeight: "600",
//     textDecorationLine: "underline",
//     textAlign: "center",
//     marginBottom: 16,
//   },
//   socialButton: {
//     backgroundColor: "white",
//     borderRadius: 8,
//     paddingVertical: 12,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     marginBottom: 12,
//   },
//   socialButtonText: {
//     color: "#666",
//     fontSize: 14,
//     fontWeight: "600",
//     marginLeft: 12,
//   },
//   footerText: {
//     color: "#2a2a2a",
//     fontSize: 11,
//     fontWeight: "500",
//     textAlign: "center",
//     marginTop: 12,
//   },
// });
