import { StyleSheet } from "react-native";

const loginStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2a2a2a",
  },
  contentContainer: {
    paddingBottom: 20,
  },
  headerSection: {
    backgroundColor: "#2a2a2a",
    paddingVertical: 40,
    alignItems: "center",
  },
  logo: {
    height: 100,
    width: 100,
    marginTop: 50,
    marginBottom: 20,
    borderRadius: 10,
  },
  logoContainer: {
    width: 100,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    position: "relative",
  },
  logoTextContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoTextInfinit: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    letterSpacing: 1,
  },
  logoTextLms: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FF8C00",
    letterSpacing: 1,
  },
  promptSection: {
    backgroundColor: "#2a2a2a",
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  promptText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FF8C00",
  },
  formSection: {
    backgroundColor: "#FF8C00",
    marginHorizontal: 16,
    marginVertical: 16,
    paddingHorizontal: 20,
    paddingVertical: 24,
    borderRadius: 20,
  },
  fieldContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2a2a2a",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "white",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: "#2a2a2a",
  },
  loginButton: {
    backgroundColor: "#2a2a2a",
    borderRadius: 8,
    paddingVertical: 14,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 12,
  },
  loginButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  forgotPasswordText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
    textDecorationLine: "underline",
    textAlign: "center",
    marginBottom: 16,
  },
  socialButton: {
    backgroundColor: "white",
    borderRadius: 8,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  socialButtonText: {
    color: "#666",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 12,
  },
  footerText: {
    color: "#2a2a2a",
    fontSize: 11,
    fontWeight: "500",
    textAlign: "center",
    marginTop: 12,
  },
});

export default loginStyles;
