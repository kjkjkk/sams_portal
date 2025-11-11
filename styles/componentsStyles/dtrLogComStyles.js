import { StyleSheet } from "react-native";

const dtrLogComStyles = StyleSheet.create({
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
    color: "#999",
  },
  cardsScrollView: {
    marginBottom: 24,
  },
  cardsContainer: {
    flexDirection: "row",
    gap: 16,
    paddingRight: 16,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    padding: 16,
    minWidth: -80,
  },
  cardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  cardLeft: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4B5563",
    marginBottom: 16,
  },
  legendContainer: {
    gap: 12,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontSize: 12,
    color: "#374151",
  },
  legendValue: {
    fontWeight: "600",
  },
  cardDivider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 16,
  },
  monthText: {
    fontSize: 12,
    color: "#4B5563",
  },
  monthValue: {
    fontWeight: "700",
    color: "#111827",
  },
  chartPlaceholder: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#EF4444",
    justifyContent: "center",
    alignItems: "center",
  },
  chartInner: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#FFFFFF",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
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
