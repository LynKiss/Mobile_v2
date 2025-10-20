import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Linking,
  Modal,
  TextInput,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../styles/ThemeContext";
import { API_URL } from "../Api/config";
import {
  Container,
  Header,
  BackButton,
  BookRow,
  CoverImage,
  InfoSection,
  BookTitle,
  BookAuthor,
  CategoryTag,
  InfoBlock,
  InfoLabel,
  InfoValue,
  BottomButtons,
  WishlistButton,
  ShelfButton,
  ButtonText,
} from "../styles/BookDetailScreen.style";

const BookDetailScreen = ({ route, navigation }: any) => {
  const { book } = route.params;
  const { theme } = useTheme();

  const [bookDetail, setBookDetail] = useState<any>(book || null);
  const [loading, setLoading] = useState(!book?.mo_ta); // nếu đã có chi tiết thì khỏi tải lại
  const [processing, setProcessing] = useState(false);
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [newReview, setNewReview] = useState({
    content: "",
    stars: 0,
  });

  // 📦 Lấy chi tiết sách từ API nếu chưa có
  useEffect(() => {
    if (!book?.ma_sach) return;

    if (!book?.mo_ta || !book?.ban_sao) {
      fetchBookDetail(book.ma_sach);
    }
  }, []);

  const fetchBookDetail = async (ma_sach: number) => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("userToken");
      const res = await fetch(`${API_URL}/api/sach/${ma_sach}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Không thể tải chi tiết sách");
      const data = await res.json();
      setBookDetail(data.data || data);
    } catch (err) {
      console.error("❌ Lỗi tải chi tiết sách:", err);
      Alert.alert("Lỗi", "Không thể tải thông tin chi tiết sách");
    } finally {
      setLoading(false);
    }
  };

  // 🧩 Yêu cầu trả sách
  const handleRequestReturn = async () => {
    if (!book.ma_phieu_muon)
      return Alert.alert("Lỗi", "Không xác định được phiếu mượn");

    Alert.alert(
      "Xác nhận trả sách",
      `Bạn có muốn trả cuốn sách "${bookDetail.tieu_de}" không?`,
      [
        {
          text: "Hủy",
          style: "cancel",
        },
        {
          text: "Đồng ý",
          onPress: async () => {
            try {
              setProcessing(true);
              const token = await AsyncStorage.getItem("userToken");
              const res = await fetch(
                `http://localhost:3000/api/tra-sach/request`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                  },
                  body: JSON.stringify({ ma_phieu_muon: book.ma_phieu_muon }),
                }
              );

              if (!res.ok) throw new Error("Không thể gửi yêu cầu trả sách");

              Alert.alert(
                "✅ Thành công",
                `Đã yêu cầu trả sách với mã phiếu mượn là ${book.ma_phieu_muon}`,
                [
                  {
                    text: "OK",
                    onPress: () => navigation.navigate("LibraryScreen"),
                  },
                ]
              );
            } catch (err) {
              console.error("❌ Lỗi khi yêu cầu trả sách:", err);
              Alert.alert("Lỗi", "Không thể gửi yêu cầu trả sách");
            } finally {
              setProcessing(false);
            }
          },
        },
      ]
    );
  };

  // 🕒 Gia hạn
  const handleExtend = async () => {
    if (!book.ma_phieu_muon)
      return Alert.alert("Lỗi", "Không xác định được phiếu mượn");
    try {
      setProcessing(true);
      const token = await AsyncStorage.getItem("userToken");
      const res = await fetch(`${API_URL}/api/phieu_muon/gia-han`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ma_phieu_muon: book.ma_phieu_muon }),
      });

      if (!res.ok) throw new Error("Không thể gửi yêu cầu gia hạn");

      Alert.alert("✅ Thành công", "Đã gửi yêu cầu gia hạn mượn sách");
    } catch (err) {
      console.error("❌ Lỗi khi gia hạn:", err);
      Alert.alert("Lỗi", "Không thể gửi yêu cầu gia hạn");
    } finally {
      setProcessing(false);
    }
  };

  // ⭐ Đánh giá sách
  const handleSubmitReview = async () => {
    if (!newReview.content.trim() || newReview.stars === 0) {
      Alert.alert("Lỗi", "Vui lòng nhập nội dung đánh giá và chọn số sao!");
      return;
    }

    try {
      setProcessing(true);
      const token = await AsyncStorage.getItem("userToken");
      const userData = await AsyncStorage.getItem("user");

      if (!token || !userData) {
        Alert.alert("Lỗi", "Bạn chưa đăng nhập!");
        return;
      }

      const user = JSON.parse(userData);
      const ma_doc_gia = user.ma_nguoi_dung;

      if (!ma_doc_gia) {
        Alert.alert("Lỗi", "Không thể xác định người dùng!");
        return;
      }

      const reviewData = {
        ma_sach: bookDetail.ma_sach,
        ma_doc_gia: ma_doc_gia,
        diem: newReview.stars,
        binh_luan: newReview.content.trim(),
        ngay_danh_gia: new Date().toISOString().split("T")[0],
      };

      const res = await fetch(`${API_URL}/api/danh_gia`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(reviewData),
      });

      console.log("Review data:", reviewData);
      console.log("Response status:", res.status);
      const responseText = await res.text();
      console.log("Response text:", responseText);

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Không thể gửi đánh giá: ${errorText}`);
      }

      Alert.alert("✅ Thành công", "Đánh giá của bạn đã được gửi!");
      setReviewModalVisible(false);
      setNewReview({ content: "", stars: 0 });
    } catch (err) {
      console.error("❌ Lỗi khi gửi đánh giá:", err);
      Alert.alert("Lỗi", "Không thể gửi đánh giá. Vui lòng thử lại!");
    } finally {
      setProcessing(false);
    }
  };

  const renderStars = (count: number, editable = false) => {
    const safeCount = isNaN(count) ? 0 : Math.max(0, Math.min(5, count));
    return Array.from({ length: 5 }).map((_, i) => (
      <Ionicons
        key={i}
        name={i < safeCount ? "star" : "star-outline"}
        size={24}
        color="#FFD700"
        style={{ marginHorizontal: 2 }}
        onPress={() => editable && setNewReview({ ...newReview, stars: i + 1 })}
      />
    ));
  };

  if (loading) {
    return (
      <Container>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator size="large" color="#2AA3AA" />
          <Text style={{ color: "#666", marginTop: 10 }}>
            Đang tải thông tin sách...
          </Text>
        </View>
      </Container>
    );
  }

  if (!bookDetail) {
    return (
      <Container>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#666" }}>Không tìm thấy thông tin sách</Text>
        </View>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <BackButton onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color="#2AA3AA" />
        </BackButton>
      </Header>

      {/* Phần cố định: Ảnh & thông tin cơ bản + Hạn trả */}
      <View
        style={{
          backgroundColor: "#fff",
          borderRadius: 12,
          marginHorizontal: 16,
          marginTop: 8,
          padding: 16,
          elevation: 4,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        }}
      >
        <BookRow>
          <CoverImage
            source={{
              uri:
                bookDetail.hinh_bia ||
                `https://picsum.photos/seed/${bookDetail.ma_sach}/200/300`,
            }}
          />
          <InfoSection>
            <BookTitle>{bookDetail.tieu_de}</BookTitle>
            <BookAuthor>{bookDetail.tac_gia || "Đang cập nhật"}</BookAuthor>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 4,
              }}
            >
              <CategoryTag>{bookDetail.ten_the_loai || ""}</CategoryTag>
              <Text
                style={{
                  paddingTop: 60,
                  paddingLeft: 12,
                  marginLeft: 8,
                  color: "#E74C3C",
                  fontWeight: "600",
                  fontSize: 14,
                }}
              >
                Hạn trả:{" "}
                {new Date(
                  book.dueDate || bookDetail.ngay_hen_tra
                ).toLocaleDateString("vi-VN")}
              </Text>
            </View>
          </InfoSection>
        </BookRow>
      </View>

      {/* Vạch ngăn cách */}
      <View
        style={{
          height: 8,
          backgroundColor: "#F8F9FA",
          marginVertical: 16,
        }}
      />

      {/* Phần cuộn: Thông tin chi tiết khác */}
      <ScrollView
        contentContainerStyle={{
          paddingBottom: 120,
          paddingHorizontal: 16,
        }}
        showsVerticalScrollIndicator={false}
      >
        <InfoBlock key="the-loai">
          <InfoLabel>THỂ LOẠI</InfoLabel>
          <InfoValue>{bookDetail.ten_the_loai || "Không xác định"}</InfoValue>
        </InfoBlock>
        <InfoBlock key="nxb">
          <InfoLabel>NHÀ XUẤT BẢN</InfoLabel>
          <InfoValue>{bookDetail.ten_nxb || "Không xác định"}</InfoValue>
        </InfoBlock>
        <InfoBlock key="ngay-xuat-ban">
          <InfoLabel>NGÀY XUẤT BẢN</InfoLabel>
          <InfoValue>
            {bookDetail.nam_xuat_ban
              ? new Date(bookDetail.nam_xuat_ban).getFullYear()
              : "Không xác định"}
          </InfoValue>
        </InfoBlock>
        <InfoBlock key="so-trang">
          <InfoLabel>SỐ TRANG</InfoLabel>
          <InfoValue>{bookDetail.so_trang || "Không xác định"}</InfoValue>
        </InfoBlock>
        <InfoBlock key="ngon-ngu">
          <InfoLabel>NGÔN NGỮ</InfoLabel>
          <InfoValue>{bookDetail.ten_ngon_ngu || "Không xác định"}</InfoValue>
        </InfoBlock>
        <InfoBlock key="isbn">
          <InfoLabel>ISBN</InfoLabel>
          <InfoValue>{bookDetail.ISBN || "Không xác định"}</InfoValue>
        </InfoBlock>
        <InfoBlock key="mo-ta">
          <InfoLabel>MÔ TẢ</InfoLabel>
          <InfoValue>
            {bookDetail.mo_ta || "Không có mô tả cho sách này."}
          </InfoValue>
        </InfoBlock>
        <InfoBlock key="ncc">
          <InfoLabel>NHÀ CUNG CẤP</InfoLabel>
          <InfoValue>{bookDetail.ten_ncc || "Không xác định"}</InfoValue>
        </InfoBlock>
        <InfoBlock key="khu-vuc">
          <InfoLabel>KHU VỰC</InfoLabel>
          <InfoValue>{bookDetail.ten_khu_vuc || "Không xác định"}</InfoValue>
        </InfoBlock>
        <InfoBlock key="so-luong-con">
          <InfoLabel>SỐ LƯỢNG CÒN</InfoLabel>
          <InfoValue>
            {bookDetail.so_luong_con > 0
              ? bookDetail.so_luong_con
              : "Sách đang hết"}
          </InfoValue>
        </InfoBlock>
        {bookDetail.thong_tin_phu && (
          <>
            <InfoBlock key="nhan-de-phu">
              <InfoLabel>NHAN ĐỀ PHỤ</InfoLabel>
              <InfoValue>
                {bookDetail.thong_tin_phu.nhan_de_phu || "Không xác định"}
              </InfoValue>
            </InfoBlock>
            <InfoBlock key="so-cutter-tac-gia">
              <InfoLabel>SỐ CUTTER TÁC GIẢ</InfoLabel>
              <InfoValue>
                {bookDetail.thong_tin_phu.so_cutter_tac_gia || "Không xác định"}
              </InfoValue>
            </InfoBlock>
            <InfoBlock key="phan-loai-tai-lieu">
              <InfoLabel>PHÂN LOẠI TÀI LIỆU</InfoLabel>
              <InfoValue>
                {bookDetail.thong_tin_phu.phan_loai_tai_lieu ||
                  "Không xác định"}
              </InfoValue>
            </InfoBlock>
            <InfoBlock key="lan-tai-ban">
              <InfoLabel>LẦN TÁI BẢN</InfoLabel>
              <InfoValue>
                {bookDetail.thong_tin_phu.lan_tai_ban || "Không xác định"}
              </InfoValue>
            </InfoBlock>
            <InfoBlock key="chu-de">
              <InfoLabel>CHỦ ĐỀ</InfoLabel>
              <InfoValue>
                {bookDetail.thong_tin_phu.chu_de || "Không xác định"}
              </InfoValue>
            </InfoBlock>
            <InfoBlock key="so-chung-tu">
              <InfoLabel>SỐ CHỨNG TỪ</InfoLabel>
              <InfoValue>
                {bookDetail.thong_tin_phu.so_chung_tu || "Không xác định"}
              </InfoValue>
            </InfoBlock>
          </>
        )}
      </ScrollView>

      {/* Nút nổi cố định - Đọc PDF */}
      {bookDetail.file_dinh_kem && bookDetail.file_dinh_kem.length > 0 && (
        <TouchableOpacity
          onPress={() => Linking.openURL(bookDetail.file_dinh_kem[0].duong_dan)}
          style={{
            position: "absolute",
            bottom: 200,
            right: 36,
            backgroundColor: "#2AA3AA",
            width: 56,
            height: 56,
            borderRadius: 28,
            justifyContent: "center",
            alignItems: "center",
            elevation: 8,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
          }}
        >
          <Ionicons name="document-outline" size={24} color="#fff" />
        </TouchableOpacity>
      )}

      {/* Nút nổi cố định - Đánh giá */}
      <TouchableOpacity
        onPress={() => setReviewModalVisible(true)}
        style={{
          position: "absolute",
          bottom: 120,
          right: 36,
          backgroundColor: "#FFD700",
          width: 56,
          height: 56,
          borderRadius: 28,
          justifyContent: "center",
          alignItems: "center",
          elevation: 8,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
        }}
      >
        <Ionicons name="star-outline" size={24} color="#fff" />
      </TouchableOpacity>

      {/* Nút dưới */}
      <BottomButtons>
        <WishlistButton onPress={handleExtend} disabled={processing}>
          <Ionicons name="time-outline" size={18} color="#fff" />
          <ButtonText>Gia hạn mượn</ButtonText>
        </WishlistButton>
        <ShelfButton onPress={handleRequestReturn} disabled={processing}>
          <Ionicons name="return-down-back-outline" size={18} color="#2AA3AA" />
          <ButtonText style={{ color: "#2AA3AA" }}>Yêu cầu trả</ButtonText>
        </ShelfButton>
      </BottomButtons>

      {/* Modal đánh giá */}
      <Modal
        visible={reviewModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setReviewModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <View
            style={{
              backgroundColor: "#fff",
              borderRadius: 12,
              padding: 20,
              width: "90%",
              maxHeight: "70%",
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                marginBottom: 16,
                textAlign: "center",
              }}
            >
              Đánh giá sách
            </Text>

            {/* Chọn số sao */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                marginBottom: 16,
              }}
            >
              {renderStars(newReview.stars, true)}
            </View>

            {/* Nhập bình luận */}
            <TextInput
              placeholder="Nhập bình luận của bạn..."
              value={newReview.content}
              onChangeText={(text) =>
                setNewReview({ ...newReview, content: text })
              }
              multiline
              numberOfLines={4}
              style={{
                borderWidth: 1,
                borderColor: "#ddd",
                borderRadius: 8,
                padding: 12,
                marginBottom: 16,
                textAlignVertical: "top",
              }}
            />

            {/* Nút hành động */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <TouchableOpacity
                onPress={() => setReviewModalVisible(false)}
                style={{
                  backgroundColor: "#ccc",
                  padding: 12,
                  borderRadius: 8,
                  flex: 1,
                  marginRight: 8,
                }}
              >
                <Text style={{ textAlign: "center", fontWeight: "bold" }}>
                  Hủy
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSubmitReview}
                disabled={processing}
                style={{
                  backgroundColor: "#2AA3AA",
                  padding: 12,
                  borderRadius: 8,
                  flex: 1,
                  marginLeft: 8,
                }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    fontWeight: "bold",
                    color: "#fff",
                  }}
                >
                  {processing ? "Đang gửi..." : "Gửi đánh giá"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </Container>
  );
};

export default BookDetailScreen;
