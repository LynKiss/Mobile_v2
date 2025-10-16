import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: "#e6e6e6",
    backgroundColor: "#fff",
    height: 64,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#222",
  },
  tabsContainer: {
    paddingHorizontal: 10,
    paddingTop: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: "#e6e6e6",
    backgroundColor: "#fff",
  },
  tabItem: {
    marginRight: 20,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
  },
  tabText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  tabTextActive: {
    color: "#2AA3A3",
    fontWeight: "700",
  },
  underline: {
    height: 2,
    backgroundColor: "#2AA3A3",
    position: "absolute",
    bottom: 0,

    borderRadius: 1,
  },

  listContainer: {
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 30,
  },
  listItem: {
    flexDirection: "row",
    marginBottom: 14,
    backgroundColor: "#fff",
    borderRadius: 8,
    overflow: "hidden",
    elevation: 1,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  listImage: {
    width: 90,
    height: 120,
    borderRadius: 6,
  },
  listContent: {
    flex: 1,
    marginLeft: 10,
    justifyContent: "center",
  },
  bookTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#222",
  },
  bookAuthor: {
    fontSize: 13,
    color: "#777",
    marginTop: 4,
  },
  gridItem: {
    flex: 1 / 3,
    marginBottom: 14,
    alignItems: "center",
  },
  gridImage: {
    width: 100,
    height: 135,
    borderRadius: 6,
    marginBottom: 6,
  },
  gridTitle: {
    fontSize: 13,
    fontWeight: "500",
    color: "#333",
    textAlign: "center",
  },
});
