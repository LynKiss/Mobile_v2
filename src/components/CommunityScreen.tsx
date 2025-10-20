import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../Api/config";

interface ReviewPost {
  ma_danh_gia: number;
  ma_doc_gia: number;
  ma_sach: number;
  binh_luan: string;
  diem: number;
  ho_ten?: string;
  tieu_de?: string;
  avatar?: string;
}

const CommunityScreen = () => {
  const [posts, setPosts] = useState<ReviewPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(`${API_URL}/api/danh_gia`);
        if (res.ok) {
          const data = await res.json();
          const token = await AsyncStorage.getItem("userToken");

          // Lấy thông tin người dùng và sách cho mỗi đánh giá
          const postsWithDetails = await Promise.all(
            data.map(async (review: ReviewPost) => {
              let ho_ten = "Ẩn danh";
              let avatar = "https://i.pravatar.cc/100?img=1"; // Default avatar
              let tieu_de = "Sách chưa rõ";

              // Fetch user info
              if (token) {
                try {
                  const userRes = await fetch(
                    `${API_URL}/api/nguoi_dung/${review.ma_doc_gia}`
                  );
                  if (userRes.ok) {
                    const userData = await userRes.json();
                    ho_ten = Array.isArray(userData)
                      ? userData[0]?.ho_ten
                      : userData?.ho_ten;
                    avatar = `https://i.pravatar.cc/100?img=${review.ma_doc_gia}`;
                  }
                } catch (err) {
                  console.log("Lỗi fetch người dùng:", err);
                }
              }

              // Fetch book info
              try {
                const bookRes = await fetch(
                  `${API_URL}/api/sach/${review.ma_sach}`
                );
                if (bookRes.ok) {
                  const bookData = await bookRes.json();
                  tieu_de = bookData.data?.tieu_de || "Sách chưa rõ";
                }
              } catch (err) {
                console.log("Lỗi fetch sách:", err);
              }

              return {
                ...review,
                ho_ten,
                avatar,
                tieu_de,
              };
            })
          );

          setPosts(postsWithDetails);
        }
      } catch (e) {
        console.log("Lỗi khi fetch đánh giá:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const renderStars = (count: number) => {
    const safeCount = isNaN(count) ? 0 : Math.max(0, Math.min(5, count));
    return Array.from({ length: 5 }).map((_, i) => (
      <Ionicons
        key={i}
        name={i < safeCount ? "star" : "star-outline"}
        size={16}
        color="#FFD700"
        style={{ marginHorizontal: 1 }}
      />
    ));
  };

  const renderItem = ({ item }: { item: ReviewPost }) => (
    <View style={styles.card}>
      <View style={styles.row}>
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
        <View>
          <Text style={styles.username}>{item.ho_ten}</Text>
          <Text style={styles.bookTitle}>đã đánh giá "{item.tieu_de}"</Text>
        </View>
      </View>
      <View style={styles.ratingRow}>{renderStars(item.diem)}</View>
      <Text style={styles.content}>{item.binh_luan}</Text>
      <View style={styles.actions}>
        <View style={styles.action}>
          <Ionicons name="heart-outline" size={18} color="#FF3B30" />
          <Text style={styles.actionText}>0</Text>
        </View>
        <View style={styles.action}>
          <Ionicons name="chatbubble-outline" size={18} color="#007AFF" />
          <Text style={styles.actionText}>0</Text>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#2AA3AA" />
      </View>
    );
  }

  return (
    <FlatList
      data={posts}
      keyExtractor={(item, index) => `${item.ma_danh_gia}-${index}`}
      renderItem={renderItem}
      contentContainerStyle={{ padding: 16 }}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  row: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  avatar: { width: 36, height: 36, borderRadius: 18, marginRight: 8 },
  username: { fontWeight: "600", fontSize: 15, color: "#1D1D1F" },
  bookTitle: { fontSize: 12, color: "#6B6B6B" },
  ratingRow: { flexDirection: "row", marginBottom: 8 },
  content: { fontSize: 14, color: "#333", marginBottom: 8 },
  actions: { flexDirection: "row" },
  action: { flexDirection: "row", alignItems: "center", marginRight: 16 },
  actionText: { marginLeft: 4, color: "#6B6B6B" },
});

export default CommunityScreen;
