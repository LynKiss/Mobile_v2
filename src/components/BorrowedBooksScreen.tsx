import React from "react";
import { View, Text, FlatList, Image, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../styles/ThemeContext";

const borrowedBooks = [
  {
    id: "1",
    title: "Thinking, Fast and Slow",
    author: "Daniel Kahneman",
    cover:
      "https://images-na.ssl-images-amazon.com/images/I/41jEbK-jG+L._SX324_BO1,204,203,200_.jpg",
    dueDate: "20/10/2025",
  },
  {
    id: "2",
    title: "Atomic Habits",
    author: "James Clear",
    cover:
      "https://m.media-amazon.com/images/I/91bYsX41DVL._AC_UF894,1000_QL80_.jpg",
    dueDate: "25/10/2025",
  },
];

const BorrowedBooksScreen = () => {
  const { theme } = useTheme();

  const renderItem = ({ item }: any) => (
    <View style={[styles.card, { backgroundColor: "#fff" }]}>
      <Image source={{ uri: item.cover }} style={styles.cover} />
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.author}>{item.author}</Text>
        <View style={styles.row}>
          <Ionicons
            name="calendar-outline"
            size={16}
            color={theme.colors.primary}
          />
          <Text style={styles.dueDate}>Hạn trả: {item.dueDate}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={borrowedBooks}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  card: {
    flexDirection: "row",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 1,
  },
  cover: { width: 60, height: 90, borderRadius: 8, marginRight: 12 },
  title: { fontSize: 16, fontWeight: "600", color: "#1D1D1F" },
  author: { color: "#6B6B6B", marginBottom: 6 },
  row: { flexDirection: "row", alignItems: "center" },
  dueDate: { color: "#007AFF", marginLeft: 4, fontSize: 13 },
});

export default BorrowedBooksScreen;
