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

interface BookDetail {
  ma_sach: number;
  tieu_de: string;
  tac_gia: string;
  hinh_bia: string;
  // Add other properties as needed
}

interface Book {
  ma_sach: number;
  tieu_de: string;
  tac_gia: string;
  hinh_bia: string;
  dueDate: string;
  ma_phieu_muon: number;
}

const BorrowedBooksScreen = ({ navigation }: any) => {
  const { theme } = useTheme();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({
    current: false,
    nearDue: false,
    overdue: false,
  });

  // 🔁 Load lại khi focus
  useEffect(() => {
    if (navigation?.addListener) {
      const unsubscribe = navigation.addListener("focus", fetchBorrowedBooks);
      return unsubscribe;
    } else {
      fetchBorrowedBooks();
    }
  }, []);

  // 🧠 Chuẩn hoá tiếng Việt
  const normalize = (str: string) =>
    (str || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/[^a-z0-9]/g, "")
      .trim();

  // 📚 Lấy danh sách sách mượn
  const fetchBorrowedBooks = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        Alert.alert("Lỗi", "Vui lòng đăng nhập lại");
        setLoading(false);
        return;
      }

      // 🧾 Lấy danh sách phiếu mượn
      const response = await fetch(`${API_URL}/api/phieu_muon/lich-su`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Không thể tải danh sách phiếu mượn");

      const slipsResponse = await response.json();
      const slips = Array.isArray(slipsResponse.data)
        ? slipsResponse.data
        : slipsResponse;

      console.log("📘 Danh sách phiếu:", slips.length);

      // ✅ Lọc phiếu "Đang mượn"
      const activeSlips = slips.filter(
        (s: any) => normalize(s.trang_thai_phieu || s.trang_thai) === "dangmuon"
      );

      console.log("✅ Phiếu đang mượn:", activeSlips.length);

      if (activeSlips.length === 0) {
        setBooks([]);
        setLoading(false);
        return;
      }

      const allBooks: Book[] = [];

      // 🔁 Duyệt từng phiếu mượn
      for (const slip of activeSlips) {
        const detailRes = await fetch(
          `${API_URL}/api/phieu_muon/lich-su/${slip.ma_phieu_muon}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!detailRes.ok) {
          console.warn(
            `⚠️ Không lấy được chi tiết phiếu ${slip.ma_phieu_muon}`
          );
          continue;
        }

        const detailData = await detailRes.json();
        const chiTiet = Array.isArray(detailData)
          ? detailData
          : detailData.data?.chi_tiet_muon ||
            detailData.data?.chi_tiet ||
            detailData.chi_tiet_muon ||
            [];

        if (!Array.isArray(chiTiet) || chiTiet.length === 0) {
          console.warn(`⚠️ Phiếu ${slip.ma_phieu_muon} không có chi tiết.`);
          continue;
        }

        // 📖 Duyệt từng sách trong phiếu và lấy chi tiết thật
        for (const item of chiTiet) {
          try {
            const bookRes = await fetch(`${API_URL}/api/sach/${item.ma_sach}`, {
              headers: { Authorization: `Bearer ${token}` },
            });

            let bookInfo: BookDetail | null = null;
            if (bookRes.ok) {
              const data = await bookRes.json();
              bookInfo = data.data as BookDetail | null;
            }

            allBooks.push({
              ma_sach: item.ma_sach,
              tieu_de: bookInfo?.tieu_de || item.ten_sach || "Sách chưa rõ tên",
              tac_gia: bookInfo?.tac_gia || "Đang cập nhật",
              hinh_bia:
                bookInfo?.hinh_bia ||
                `https://picsum.photos/seed/${item.ma_sach}/200/300`,
              dueDate: item.han_tra || slip.han_tra,
              ma_phieu_muon: slip.ma_phieu_muon,
            });
          } catch (err) {
            console.warn("⚠️ Lỗi lấy chi tiết sách:", item.ma_sach, err);
          }
        }
      }

      console.log("📚 Tổng số sách đang mượn:", allBooks.length);
      setBooks(allBooks);
    } catch (err) {
      console.error("❌ Lỗi khi tải sách đang mượn:", err);
      Alert.alert("Lỗi", "Không thể tải danh sách sách mượn");
    } finally {
      setLoading(false);
    }
  };

  // ⏰ Phân loại sách
  const categorizeBooks = (books: Book[]) => {
    const today = new Date();
    const threeDays = 3 * 24 * 60 * 60 * 1000;
    const current: Book[] = [];
    const nearDue: Book[] = [];
    const overdue: Book[] = [];

    books.forEach((book) => {
      const due = new Date(book.dueDate);
      const diff = due.getTime() - today.getTime();
      if (diff < 0) overdue.push(book);
      else if (diff <= threeDays) nearDue.push(book);
      else current.push(book);
    });

    return { current, nearDue, overdue };
  };

  const { current, nearDue, overdue } = categorizeBooks(books);

  const renderItem = ({ item }: { item: Book }) => (
    <TouchableOpacity
      onPress={() =>
        navigation?.navigate?.("BookDetailScreen_MT", {
          book: item,
        })
      }
      style={[styles.card, { backgroundColor: theme.colors.surface || "#fff" }]}
    >
      <Image source={{ uri: item.hinh_bia }} style={styles.cover} />
      <View style={{ flex: 1 }}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          {item.tieu_de}
        </Text>
        <Text style={[styles.author, { color: theme.colors.textSecondary }]}>
          {item.tac_gia}
        </Text>
        <View style={styles.row}>
          <Ionicons
            name="calendar-outline"
            size={16}
            color={theme.colors.primary}
          />
          <Text style={[styles.dueDate, { color: theme.colors.primary }]}>
            Hạn trả: {new Date(item.dueDate).toLocaleDateString("vi-VN")}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderSection = (
    key: string,
    title: string,
    data: Book[],
    color: string
  ) => {
    if (data.length === 0) return null;
    const isExpanded = expanded[key];
    const visibleData = isExpanded ? data : data.slice(0, 2);

    return (
      <View style={{ marginBottom: 20, paddingHorizontal: 16 }}>
        <View
          style={{
            marginBottom: 16,
            paddingLeft: 10,
            borderLeftWidth: 3,
            borderLeftColor: color,
          }}
        >
          <Text style={{ fontWeight: "500", fontSize: 15, color: "#111111" }}>
            {title} ({data.length})
          </Text>
        </View>
        <FlatList
          data={visibleData}
          keyExtractor={(item) => `${item.ma_phieu_muon}-${item.ma_sach}`}
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

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text
          style={[styles.loadingText, { color: theme.colors.textSecondary }]}
        >
          Đang tải sách mượn...
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#f5f7fa" }}>
      {renderSection("current", "📘 Sách đang mượn", current, "#2aa3a3")}
      {renderSection("nearDue", "⏳ Sách sắp đến hạn", nearDue, "#FFA500")}
      {renderSection("overdue", "⛔ Sách quá hạn", overdue, "#FF3B30")}
      {books.length === 0 && !loading && (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: "#9b9b9b" }]}>
            Không có sách đang mượn
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  loadingContainer: { justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 10, fontSize: 16 },
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
  title: { fontSize: 16, fontWeight: "600" },
  author: { marginBottom: 6 },
  row: { flexDirection: "row", alignItems: "center" },
  dueDate: { marginLeft: 4, fontSize: 13 },
  sectionTitle: { fontSize: 18, fontWeight: "700", marginBottom: 8 },
  toggleButton: { paddingVertical: 6, alignItems: "center" },
  toggleText: { fontWeight: "600" },
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { fontSize: 16 },
});

export default BorrowedBooksScreen;
