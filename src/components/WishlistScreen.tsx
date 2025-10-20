import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../styles/ThemeContext";
import { API_URL } from "../Api/config";
import { useNavigation } from "@react-navigation/native";

const WishlistScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<any>();

  const [wishlistBooks, setWishlistBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);

  // 📦 Lấy danh sách sách yêu thích
  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("userToken");
      const res = await fetch(`${API_URL}/api/sach_yeu_thich`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Không thể tải danh sách yêu thích");
      const data = await res.json();
      setWishlistBooks(data || []);
    } catch (err) {
      console.error("❌ Lỗi tải wishlist:", err);
      Alert.alert("Lỗi", "Không thể tải danh sách sách yêu thích");
    } finally {
      setLoading(false);
    }
  };

  // 🗑️ Xóa sách khỏi wishlist
  const handleRemoveFromWishlist = async (ma_sach: number) => {
    Alert.alert(
      "Xác nhận xóa",
      `Bạn có muốn xóa "${
        wishlistBooks.find((b) => b.ma_sach === ma_sach)?.tieu_de
      }" khỏi danh sách yêu thích không?`,
      [
        {
          text: "Hủy",
          style: "cancel",
        },
        {
          text: "Xóa",
          style: "destructive",
          onPress: async () => {
            try {
              setProcessing(ma_sach.toString());
              const token = await AsyncStorage.getItem("userToken");
              const res = await fetch(
                `${API_URL}/api/sach_yeu_thich/${ma_sach}`,
                {
                  method: "DELETE",
                  headers: { Authorization: `Bearer ${token}` },
                }
              );

              if (!res.ok) throw new Error("Không thể xóa sách khỏi yêu thích");

              // Cập nhật danh sách local
              setWishlistBooks((prev) =>
                prev.filter((book) => book.ma_sach !== ma_sach)
              );
              Alert.alert(
                "✅ Thành công",
                "Đã xóa sách khỏi danh sách yêu thích"
              );
            } catch (err) {
              console.error("❌ Lỗi xóa wishlist:", err);
              Alert.alert("Lỗi", "Không thể xóa sách khỏi danh sách yêu thích");
            } finally {
              setProcessing(null);
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }: any) => (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: "#fff" }]}
      onPress={() => navigation.navigate("BookDetail", { book: item })}
    >
      <Image
        source={{
          uri:
            item.hinh_bia ||
            `https://picsum.photos/seed/${item.ma_sach}/200/300`,
        }}
        style={styles.cover}
      />
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{item.tieu_de}</Text>
        <Text style={styles.author}>{item.tac_gia || "Đang cập nhật"}</Text>
        <Text style={styles.category}>{item.ten_the_loai || ""}</Text>
      </View>
      <TouchableOpacity
        onPress={() => handleRemoveFromWishlist(item.ma_sach)}
        disabled={processing === item.ma_sach.toString()}
        style={styles.removeButton}
      >
        {processing === item.ma_sach.toString() ? (
          <ActivityIndicator size="small" color="#E74C3C" />
        ) : (
          <Ionicons name="heart" size={24} color="#E74C3C" />
        )}
      </TouchableOpacity>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#2AA3AA" />
          <Text style={{ color: "#666", marginTop: 10 }}>
            Đang tải danh sách yêu thích...
          </Text>
        </View>
      </View>
    );
  }

  if (wishlistBooks.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.center}>
          <Ionicons name="heart-outline" size={64} color="#CCC" />
          <Text style={styles.emptyText}>Danh sách yêu thích trống</Text>
          <Text style={styles.emptySubtext}>
            Thêm sách vào danh sách yêu thích để xem ở đây
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={wishlistBooks}
        keyExtractor={(item) => item.ma_sach.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  card: {
    flexDirection: "row",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 1,
    alignItems: "center",
  },
  cover: { width: 80, height: 120, borderRadius: 10, marginRight: 12 },
  title: { fontSize: 16, fontWeight: "600", color: "#1D1D1F" },
  author: { color: "#6B6B6B", marginBottom: 4 },
  category: { color: "#2AA3AA", fontSize: 14, fontWeight: "500" },
  removeButton: {
    padding: 8,
    marginLeft: 8,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#666",
    marginTop: 16,
    textAlign: "center",
  },
  emptySubtext: {
    fontSize: 14,
    color: "#999",
    marginTop: 8,
    textAlign: "center",
  },
});

export default WishlistScreen;
