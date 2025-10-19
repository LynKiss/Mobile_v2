import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
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
  {
    id: "3",
    title: "Deep Work",
    author: "Cal Newport",
    cover:
      "https://m.media-amazon.com/images/I/71g2ednj0JL._AC_UF1000,1000_QL80_.jpg",
    dueDate: "15/10/2025",
  },
  {
    id: "4",
    title: "The Power of Habit",
    author: "Charles Duhigg",
    cover:
      "https://m.media-amazon.com/images/I/81KqrwS1nNL._AC_UF1000,1000_QL80_.jpg",
    dueDate: "18/10/2025",
  },
  {
    id: "5",
    title: "Clean Code",
    author: "Robert C. Martin",
    cover:
      "https://m.media-amazon.com/images/I/41xShlnTZTL._SX374_BO1,204,203,200_.jpg",
    dueDate: "22/10/2025",
  },
];

// 🔸 Hàm convert ngày
const parseDate = (dateString: string) => {
  const [day, month, year] = dateString.split("/").map(Number);
  return new Date(year, month - 1, day);
};

// 🔸 Phân loại sách theo hạn
const categorizeBooks = (books: any[]) => {
  const today = new Date();
  const threeDays = 3 * 24 * 60 * 60 * 1000;
  const current: any[] = [];
  const nearDue: any[] = [];
  const overdue: any[] = [];

  books.forEach((book) => {
    const due = parseDate(book.dueDate);
    const diff = due.getTime() - today.getTime();
    if (diff < 0) overdue.push(book);
    else if (diff <= threeDays) nearDue.push(book);
    else current.push(book);
  });

  return { current, nearDue, overdue };
};

const BorrowedBooksScreen = () => {
  const { theme } = useTheme();
  const { current, nearDue, overdue } = categorizeBooks(borrowedBooks);

  // ✅ state quản lý mở rộng từng nhóm
  const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({
    current: false,
    nearDue: false,
    overdue: false,
  });

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

  const renderSection = (
    key: string,
    title: string,
    data: any[],
    color: string
  ) => {
    if (data.length === 0) return null;

    const isExpanded = expanded[key];
    const visibleData = isExpanded ? data : data.slice(0, 2);

    return (
      <View style={{ marginBottom: 20 }}>
        <Text style={[styles.sectionTitle, { color }]}>{title}</Text>
        <FlatList
          data={visibleData}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          scrollEnabled={false}
        />
        {data.length > 2 && (
          <TouchableOpacity
            style={styles.toggleButton}
            onPress={() =>
              setExpanded((prev) => ({ ...prev, [key]: !isExpanded }))
            }
          >
            <Text style={styles.toggleText}>
              {isExpanded ? "Thu gọn ▲" : `Xem thêm (${data.length - 2}) ▼`}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {renderSection("current", "📘 Sách đang mượn", current, "#007AFF")}
      {renderSection("nearDue", "⏳ Sách sắp đến hạn", nearDue, "#FFA500")}
      {renderSection("overdue", "⛔ Sách quá hạn", overdue, "#FF3B30")}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
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
  sectionTitle: { fontSize: 18, fontWeight: "700", marginBottom: 8 },
  toggleButton: { paddingVertical: 6, alignItems: "center" },
  toggleText: { color: "#007AFF", fontWeight: "600" },
});

export default BorrowedBooksScreen;
