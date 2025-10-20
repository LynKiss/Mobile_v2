import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { API_URL } from "../Api/config";
import styles from "../styles/BookScreens.style";

const filters = [
  { key: "all", label: "Tất cả" },
  { key: "title", label: "Tiêu đề" },
  { key: "author", label: "Tác giả" },
  { key: "category", label: "Thể loại" },
];

export default function SearchScreen() {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [books, setBooks] = useState<any[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch books from API
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/api/sach`);
        if (response.ok) {
          const data = await response.json();
          setBooks(data.data || []);
          setFilteredBooks(data.data || []);
        } else {
          console.error("Failed to fetch books");
        }
      } catch (error) {
        console.error("Error fetching books:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  // Filter books based on search query and active filter
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredBooks(books);
    } else {
      const filtered = books.filter((book) => {
        const query = searchQuery.toLowerCase();
        switch (activeFilter) {
          case "title":
            return book.tieu_de.toLowerCase().includes(query);
          case "author":
            return book.tac_gia.toLowerCase().includes(query);
          case "category":
            return book.ten_the_loai.toLowerCase().includes(query);
          default:
            return (
              book.tieu_de.toLowerCase().includes(query) ||
              book.tac_gia.toLowerCase().includes(query) ||
              book.ten_the_loai.toLowerCase().includes(query)
            );
        }
      });
      setFilteredBooks(filtered);
    }
  }, [searchQuery, activeFilter, books]);

  const renderBookItem = ({ item }: any) => {
    const handlePress = () => {
      (navigation as any).navigate("BookDetail", { book: item });
    };

    return (
      <TouchableOpacity onPress={handlePress} style={styles.listItem}>
        <Image
          source={{
            uri: item.hinh_bia || "https://picsum.photos/200/300?random",
          }}
          style={styles.listImage}
        />
        <View style={styles.listContent}>
          <Text style={styles.bookTitle} numberOfLines={2}>
            {item.tieu_de}
          </Text>
          <Text style={styles.bookAuthor}>{item.tac_gia}</Text>
          <Text style={styles.bookMeta}>Thể loại: {item.ten_the_loai}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back-outline" size={22} color="#222" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tìm kiếm sách</Text>
        <View style={{ width: 22 }} />
      </View>

      <View style={{ paddingHorizontal: 16, paddingVertical: 10 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#f0f8ff",
            borderRadius: 12,
            paddingHorizontal: 12,
            paddingVertical: 10,
            shadowColor: "#000",
            shadowOpacity: 0.1,
            shadowRadius: 4,
            shadowOffset: { width: 0, height: 2 },
            elevation: 3,
          }}
        >
          <Ionicons name="search-outline" size={20} color="#2AA3A3" />
          <TextInput
            style={{
              flex: 1,
              marginLeft: 8,
              fontSize: 16,
              color: "#222",
            }}
            placeholder="Nhập từ khóa tìm kiếm..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery("")}
              activeOpacity={0.7}
            >
              <Ionicons name="close-circle" size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>

        {/* Filter buttons */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingVertical: 10,
            paddingHorizontal: 4,
          }}
        >
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter.key}
              onPress={() => setActiveFilter(filter.key)}
              style={{
                backgroundColor:
                  activeFilter === filter.key ? "#2AA3A3" : "#e6f7ff",
                borderRadius: 20,
                paddingHorizontal: 16,
                paddingVertical: 8,
                marginRight: 8,
                borderWidth: 1,
                borderColor:
                  activeFilter === filter.key ? "#2AA3A3" : "#cceeff",
              }}
              activeOpacity={0.7}
            >
              <Text
                style={{
                  color: activeFilter === filter.key ? "#fff" : "#2AA3A3",
                  fontSize: 14,
                  fontWeight: "600",
                }}
              >
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {loading ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color="#2AA3A3" />
          <Text style={{ marginTop: 10, color: "#666" }}>Đang tải sách...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredBooks}
          keyExtractor={(item) => item.ma_sach.toString()}
          renderItem={renderBookItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                paddingTop: 50,
              }}
            >
              <Ionicons name="search-outline" size={48} color="#ccc" />
              <Text
                style={{
                  fontSize: 16,
                  color: "#666",
                  marginTop: 10,
                  textAlign: "center",
                }}
              >
                {searchQuery
                  ? "Không tìm thấy sách nào phù hợp với từ khóa."
                  : "Nhập từ khóa để bắt đầu tìm kiếm."}
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}
