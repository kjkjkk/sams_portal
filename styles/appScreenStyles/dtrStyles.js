import { StyleSheet } from "react-native";

const dtrStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollView: {
    flex: 1,
    paddingBottom: 24, // Gap at the bottom
  },
  scrollViewContent: {
    paddingBottom: 24, // Gap at the bottom
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  headerContent: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000",
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  userSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  userName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
  },
  logoSection: {
    alignItems: "center",
    gap: 6,
  },
  logoText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#666",
    letterSpacing: 0.5,
  },
  dtrHeaderContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  dtrTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
    letterSpacing: 0.5,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#ddd",
    marginLeft: 4,
  },
  filterContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 10,
  },
  filterButtonsContainer: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  filterButtonActive: {
    borderBottomColor: "#F97316",
  },
  filterButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#666",
  },
  filterButtonTextActive: {
    color: "#F97316",
  },
  dropdownWrapper: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  dropdown: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#ddd",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
  },
  dropdownText: {
    fontSize: 14,
    color: "#999",
    fontWeight: "500",
  },
  dropdownMenu: {
    marginTop: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    overflow: "hidden",
  },
  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  dropdownItemText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  searchContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#ddd",
    fontSize: 14,
    backgroundColor: "#f9f9f9",
    color: "#333",
  },
  searchButton: {
    backgroundColor: "#F97316",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  tableContainer: {
    marginHorizontal: 16,
    marginBottom: 0, // Removed because paddingBottom is in scrollViewContent
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    overflow: "hidden",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f5f5f5",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  tableHeaderCell: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 13,
    fontWeight: "700",
    color: "#333",
    textAlign: "center",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    backgroundColor: "#fff",
  },
  tableRowAlternate: {
    backgroundColor: "#fafafa",
  },
  tableCell: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 13,
    color: "#333",
    textAlign: "center",
  },
  idCell: {
    flex: 0.8,
    minWidth: 50,
  },
  nameCell: {
    flex: 1.5,
    minWidth: 150,
  },
  schoolCell: {
    flex: 1,
    minWidth: 100,
  },
  userTypeCell: {
    flex: 1,
    minWidth: 100,
  },
  statusCell: {
    flex: 0.9,
    minWidth: 80,
  },
  actionsCell: {
    flex: 1,
    minWidth: 100,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  actionButton: {
    padding: 6,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default dtrStyles;
