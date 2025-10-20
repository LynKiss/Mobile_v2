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
        <InfoBlock>
          <InfoLabel>THỂ LOẠI</InfoLabel>
          <InfoValue>{bookDetail.ten_the_loai || "Không xác định"}</InfoValue>
        </InfoBlock>
        <InfoBlock>
          <InfoLabel>NHÀ XUẤT BẢN</InfoLabel>
          <InfoValue>{bookDetail.ten_nxb || "Không xác định"}</InfoValue>
        </InfoBlock>
        <InfoBlock>
          <InfoLabel>NGÀY XUẤT BẢN</InfoLabel>
          <InfoValue>
            {bookDetail.nam_xuat_ban
              ? new Date(bookDetail.nam_xuat_ban).getFullYear()
              : "Không xác định"}
          </InfoValue>
        </InfoBlock>
        <InfoBlock>
          <InfoLabel>SỐ TRANG</InfoLabel>
          <InfoValue>{bookDetail.so_trang || "Không xác định"}</InfoValue>
        </InfoBlock>
        <InfoBlock>
          <InfoLabel>NGÔN NGỮ</InfoLabel>
          <InfoValue>{bookDetail.ten_ngon_ngu || "Không xác định"}</InfoValue>
        </InfoBlock>
        <InfoBlock>
          <InfoLabel>ISBN</InfoLabel>
          <InfoValue>{bookDetail.ISBN || "Không xác định"}</InfoValue>
        </InfoBlock>
        <InfoBlock>
          <InfoLabel>MÔ TẢ</InfoLabel>
          <InfoValue>
            {bookDetail.mo_ta || "Không có mô tả cho sách này."}
          </InfoValue>
        </InfoBlock>
        <InfoBlock>
          <InfoLabel>NHÀ CUNG CẤP</InfoLabel>
          <InfoValue>{bookDetail.ten_ncc || "Không xác định"}</InfoValue>
        </InfoBlock>
        <InfoBlock>
          <InfoLabel>KHU VỰC</InfoLabel>
          <InfoValue>{bookDetail.ten_khu_vuc || "Không xác định"}</InfoValue>
        </InfoBlock>
        <InfoBlock>
          <InfoLabel>SỐ LƯỢNG CÒN</InfoLabel>
          <InfoValue>
            {bookDetail.so_luong_con > 0
              ? bookDetail.so_luong_con
              : "Sách đang hết"}
          </InfoValue>
        </InfoBlock>
        {bookDetail.thong_tin_phu && (
          <>
            <InfoBlock>
              <InfoLabel>NHAN ĐỀ PHỤ</InfoLabel>
              <InfoValue>
                {bookDetail.thong_tin_phu.nhan_de_phu || "Không xác định"}
              </InfoValue>
            </InfoBlock>
            <InfoBlock>
              <InfoLabel>SỐ CUTTER TÁC GIẢ</InfoLabel>
              <InfoValue>
                {bookDetail.thong_tin_phu.so_cutter_tac_gia || "Không xác định"}
              </InfoValue>
            </InfoBlock>
            <InfoBlock>
              <InfoLabel>PHÂN LOẠI TÀI LIỆU</InfoLabel>
              <InfoValue>
                {bookDetail.thong_tin_phu.phan_loai_tai_lieu ||
                  "Không xác định"}
              </InfoValue>
            </InfoBlock>
            <InfoBlock>
              <InfoLabel>LẦN TÁI BẢN</InfoLabel>
              <InfoValue>
                {bookDetail.thong_tin_phu.lan_tai_ban || "Không xác định"}
              </InfoValue>
            </InfoBlock>
            <InfoBlock>
              <InfoLabel>CHỦ ĐỀ</InfoLabel>
              <InfoValue>
                {bookDetail.thong_tin_phu.chu_de || "Không xác định"}
              </InfoValue>
            </InfoBlock>
            <InfoBlock>
              <InfoLabel>SỐ CHỨNG TỪ</InfoLabel>
              <InfoValue>
                {bookDetail.thong_tin_phu.so_chung_tu || "Không xác định"}
              </InfoValue>
            </InfoBlock>
          </>
        )}
      </ScrollView>

      {/* Nút nổi cố định */}
      {bookDetail.file_dinh_kem && bookDetail.file_dinh_kem.length > 0 && (
        <TouchableOpacity
          onPress={() => Linking.openURL(bookDetail.file_dinh_kem[0].duong_dan)}
          style={{
            position: "absolute",
            bottom: 120,
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
    </Container>
  );
};

export default BookDetailScreen;
