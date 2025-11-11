import { StyleSheet } from "react-native";

const dtrLogStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fafafaff",
    padding: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#666",
  },
  errorText: {
    fontSize: 14,
    color: "#EF4444",
    textAlign: "center",
  },
  emptyText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  tableScroll: {
    marginBottom: 24,
  },
  table: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    overflow: "hidden",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
  },
  tableRowAlt: {
    backgroundColor: "#F9FAFB",
  },
  tableCell: {
    paddingVertical: 12,
    textAlign: "justify",
    paddingHorizontal: 8,
    fontSize: 12,
    color: "#374151",
    borderRightWidth: 1,
    borderRightColor: "#E5E7EB",
  },
  tableHeader: {
    backgroundColor: "#FF8C00",
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 13,
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  paginationButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#FF8C00",
    borderRadius: 6,
  },
  paginationButtonDisabled: {
    backgroundColor: "#D1D5DB",
  },
  paginationButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  pageInfo: {
    fontSize: 12,
    color: "#4B5563",
    fontWeight: "500",
  },
});

export default dtrLogStyles;
