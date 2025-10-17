import React from "react";
import { View, Text, FlatList, Image, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../styles/ThemeContext";

const wishlistBooks = [
  {
    id: "1",
    title: "The Let Them Theory",
    author: "Mel Robbins",
    cover:
      "https://images-na.ssl-images-amazon.com/images/I/71jTqUrcQ9L._AC_UL600_SR600,600_.jpg",
    price: "$15.68",
    rating: 4.9,
  },
];

const WishlistScreen = () => {
  const { theme } = useTheme();

  const renderItem = ({ item }: any) => (
    <View style={[styles.card, { backgroundColor: "#fff" }]}>
      <Image source={{ uri: item.cover }} style={styles.cover} />
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.author}>{item.author}</Text>
        <View style={styles.row}>
          <Ionicons name="star" size={16} color="#FFD700" />
          <Text style={styles.rating}>{item.rating} ★</Text>
        </View>
        <Text style={styles.price}>{item.price}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={wishlistBooks}
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
  cover: { width: 80, height: 120, borderRadius: 10, marginRight: 12 },
  title: { fontSize: 16, fontWeight: "600", color: "#1D1D1F" },
  author: { color: "#6B6B6B", marginBottom: 6 },
  row: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
  rating: { color: "#1D1D1F", marginLeft: 4, fontSize: 14 },
  price: {
    color: "#007AFF",
    fontWeight: "700",
    marginTop: 4,
  },
});

export default WishlistScreen;
