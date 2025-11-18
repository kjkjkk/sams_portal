import { StyleSheet } from "react-native";

const homeStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollView: {
    flex: 1,
    paddingBottom: 30, // Gap at the bottom
  },
  scrollViewContent: {
    paddingBottom: 30, // Gap at the bottom
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
});
export default homeStyles;
