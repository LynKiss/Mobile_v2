import React, { useState, useEffect } from "react";
import {
  Animated,
  Easing,
  ScrollView,
  Modal,
  View,
  TouchableOpacity,
  TextInput,
  FlatList,
  Linking,
  ActivityIndicator,
  Share,
  Platform,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import { API_URL } from "../Api/config";
import { WebView } from "react-native-webview";
import {
  Container,
  Header,
  BackButton,
  BookRow,
  CoverImage,
  InfoSection,
  BookTitle,
  BookAuthor,
  StarsRow,
  RatingText,
  CategoryTag,
  TabsContainer,
  TabButton,
  TabText,
  TabUnderline,
  Divider,
  InfoBlock,
  InfoLabel,
  InfoValue,
  BottomButtons,
  WishlistButton,
  ShelfButton,
  ButtonText,
} from "../styles/BookDetailScreen.style";

const BookDetailScreen: React.FC<any> = ({ navigation }) => {
  const route = useRoute();
  const { book } = route.params as { book: any };

  const [activeTab, setActiveTab] = useState<"info" | "review" | "related">(
    "info"
  );
  const [fadeAnim] = useState(new Animated.Value(1));
  const [underlineX] = useState(new Animated.Value(0));

  const [selectedReview, setSelectedReview] = useState<any>(null);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [bookDetail, setBookDetail] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  const [newReview, setNewReview] = useState({
    name: "",
    content: "",
    stars: 0,
  });

  const [reviews, setReviews] = useState<any[]>([]);

  const [scrollY] = useState(new Animated.Value(0));
  const [menuVisible, setMenuVisible] = useState(false);
  const [pdfModalVisible, setPdfModalVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  const relatedBooks = [
    {
      id: 1,
      title: "Đắc Nhân Tâm",
      author: "Dale Carnegie",
      thumb: "https://picsum.photos/200/300?random=11",
    },
    {
      id: 2,
      title: "Thói quen thành công",
      author: "Stephen Covey",
      thumb: "https://picsum.photos/200/300?random=12",
    },
    {
      id: 3,
      title: "Đánh thức con người phi thường",
      author: "Tony Robbins",
      thumb: "https://picsum.photos/200/300?random=13",
    },
  ];

  const headerHeight = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [200, 0],
    extrapolate: "clamp",
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 150],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  // Fetch book details and reviews
  useEffect(() => {
    const fetchBookDetail = async () => {
      try {
        const response = await fetch(`${API_URL}/api/sach/${book.ma_sach}`);
        if (response.ok) {
          const data = await response.json();
          // Update with detailed API data if available
          setBookDetail(data.data);
        } else {
          console.error("Failed to fetch detailed book data");
        }
      } catch (error) {
        console.error("Error fetching detailed book data:", error);
      }
    };

    const fetchReviews = async () => {
      try {
        const res = await fetch(`${API_URL}/api/danh_gia`);
        if (res.ok) {
          const data = await res.json();
          const token = await AsyncStorage.getItem("userToken");
          // Lọc đánh giá theo sách hiện tại
          const filtered = data.filter(
            (rv: any) => rv.ma_sach === book.ma_sach
          );

          // Lặp qua để lấy tên độc giả
          const reviewsWithUser = await Promise.all(
            filtered.map(async (rv: any) => {
              if (!token) {
                return { ...rv, ho_ten: "Ẩn danh" };
              }
              try {
                const userRes = await fetch(
                  `${API_URL}/api/nguoi_dung/${rv.ma_doc_gia}`
                );
                if (userRes.ok) {
                  const userData = await userRes.json();
                  return {
                    ...rv,
                    ho_ten: Array.isArray(userData)
                      ? userData[0]?.ho_ten
                      : userData?.ho_ten,
                  };
                }
              } catch (err) {
                console.log("Lỗi fetch người dùng:", err);
              }
              return { ...rv, ho_ten: "Ẩn danh" };
            })
          );

          setReviews(reviewsWithUser);
        }
      } catch (e) {
        console.log("Lỗi khi fetch đánh giá:", e);
      }
    };

    const checkWishlistStatus = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        if (!token) return;

        const res = await fetch(`${API_URL}/api/sach_yeu_thich`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          const isInWishlist = data.some(
            (b: any) => b.ma_sach === book.ma_sach
          );
          setIsInWishlist(isInWishlist);
        }
      } catch (err) {
        console.error("Lỗi kiểm tra wishlist:", err);
      }
    };

    if (book?.ma_sach) {
      setLoading(true);
      Promise.all([
        fetchBookDetail(),
        fetchReviews(),
        checkWishlistStatus(),
      ]).finally(() => {
        setLoading(false);
      });
      // Force stop loading after 5 seconds to prevent infinite loading
      setTimeout(() => {
        setLoading(false);
      }, 5000);
    } else {
      setLoading(false);
    }
  }, [book?.ma_sach]);

  const handleTabChange = (tab: "info" | "review" | "related") => {
    if (tab === activeTab) return;

    const tabIndex = { info: 0, review: 1, related: 2 }[tab];
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(underlineX, {
        toValue: tabIndex,
        duration: 300,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: false,
      }),
    ]).start(() => {
      setActiveTab(tab);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });
  };

  const handleAddReview = () => {
    if (!newReview.name || !newReview.content || newReview.stars === 0) return;

    const newR = {
      id: Date.now(),
      name: newReview.name,
      stars: newReview.stars,
      short: newReview.content.slice(0, 40) + "...",
      detail: newReview.content,
    };
    setReviews((prev) => [newR, ...prev]);
    setAddModalVisible(false);
    setNewReview({ name: "", content: "", stars: 0 });
  };

  const renderStars = (count: number, editable = false) => {
    const safeCount = isNaN(count) ? 0 : Math.max(0, Math.min(5, count));
    return Array.from({ length: 5 }).map((_, i) => (
      <Ionicons
        key={i}
        name={i < safeCount ? "star" : "star-outline"}
        size={18}
        color="#FFD700"
        style={{ marginHorizontal: 1 }}
        onPress={() => editable && setNewReview({ ...newReview, stars: i + 1 })}
      />
    ));
  };

  const openPDF = () => {
    setPdfModalVisible(true);
  };

  const shareBook = async () => {
    try {
      const result = await Share.share({
        message: `Check out this book: ${bookDetail?.tieu_de} by ${bookDetail?.tac_gia}`,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      console.error(error);
    }
  };

  const nextPage = () => {
    setCurrentPage((prev) => prev + 1);
  };

  const prevPage = () => {
    setCurrentPage((prev) => Math.max(0, prev - 1));
  };

  // Hàm mượn sách
  const doBorrowBook = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      console.log("Token lấy từ AsyncStorage:", token);

      if (!token) {
        Alert.alert("Lỗi", "Bạn chưa đăng nhập!");
        return;
      }

      const payload = {
        ngay_du_kien_muon: new Date().toISOString().split("T")[0],
        ghi_chu: "",
        chi_tiet: [
          {
            ma_sach: book.ma_sach,
            so_luong: 1,
          },
        ],
      };

      console.log("Payload gửi API:", payload);

      const response = await fetch(`${API_URL}/api/dat-muon`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      console.log("Status API:", response.status);

      if (response.ok) {
        Alert.alert("Thành công", "Đã mượn sách thành công!");
        navigation.goBack();
      } else if (response.status === 401) {
        Alert.alert(
          "Lỗi",
          "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!"
        );
      } else {
        const errText = await response.text();
        Alert.alert("Lỗi", `Không thể mượn sách: ${errText}`);
      }
    } catch (error) {
      console.error("Borrow error:", error);
      Alert.alert("Lỗi", "Có lỗi xảy ra khi gọi API!");
    }
  };

  const handleBorrowBook = () => {
    if (Platform.OS === "web") {
      const confirmed = window.confirm("Bạn có muốn mượn sách này không?");
      if (confirmed) {
        console.log("==> Đã ấn nút mượn sách");
        doBorrowBook();
      }
    } else {
      Alert.alert("Xác nhận mượn sách", "Bạn có muốn mượn sách này không?", [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xác nhận",
          onPress: () => {
            console.log("==> Đã ấn nút mượn sách");
            doBorrowBook();
          },
        },
      ]);
    }
  };

  // Hàm thêm/xóa wishlist
  const handleWishlistToggle = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        Alert.alert("Lỗi", "Bạn chưa đăng nhập!");
        return;
      }

      setWishlistLoading(true);

      if (isInWishlist) {
        // Xóa khỏi wishlist
        const response = await fetch(
          `${API_URL}/api/sach_yeu_thich/${book.ma_sach}`,
          {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.ok) {
          setIsInWishlist(false);
          Alert.alert("Thành công", "Đã xóa khỏi danh sách yêu thích!");
        } else {
          Alert.alert("Lỗi", "Không thể xóa khỏi danh sách yêu thích!");
        }
      } else {
        // Thêm vào wishlist
        const response = await fetch(`${API_URL}/api/sach_yeu_thich`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ ma_sach: book.ma_sach }),
        });

        if (response.ok) {
          setIsInWishlist(true);
          Alert.alert("Thành công", "Đã thêm vào danh sách yêu thích!");
        } else {
          Alert.alert("Lỗi", "Không thể thêm vào danh sách yêu thích!");
        }
      }
    } catch (error) {
      console.error("Wishlist error:", error);
      Alert.alert("Lỗi", "Có lỗi xảy ra!");
    } finally {
      setWishlistLoading(false);
    }
  };

  if (loading) {
    return (
      <Container>
        <Header>
          <BackButton onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={22} color="#2AA3AA" />
          </BackButton>
        </Header>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color="#2AA3AA" />
        </View>
      </Container>
    );
  }

  return (
    <Container>
      <Animated.View
        style={{
          overflow: "hidden",
        }}
      >
        <Header style={{ opacity: headerOpacity }}>
          <BackButton onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={22} color="#2AA3AA" />
          </BackButton>
          <TouchableOpacity
            onPress={() => setMenuVisible(true)}
            style={{ position: "absolute", right: 16 }}
          >
            <Ionicons name="ellipsis-vertical" size={22} color="#2AA3AA" />
          </TouchableOpacity>
        </Header>
      </Animated.View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {/* Ảnh & thông tin */}
        <BookRow>
          <CoverImage
            source={{
              uri:
                bookDetail?.hinh_bia || "https://picsum.photos/200/300?random",
            }}
          />
          <InfoSection>
            <BookTitle>{bookDetail?.tieu_de || "Unknown Title"}</BookTitle>
            <BookAuthor>{bookDetail?.tac_gia || "Unknown Author"}</BookAuthor>
            <StarsRow>
              {renderStars(bookDetail?.thong_ke_danh_gia?.diem_trung_binh || 0)}
            </StarsRow>
            <RatingText>
              (
              {isNaN(bookDetail?.thong_ke_danh_gia?.tong_danh_gia)
                ? 0
                : bookDetail?.thong_ke_danh_gia?.tong_danh_gia || 0}
              )
            </RatingText>
            <CategoryTag>{bookDetail?.ten_the_loai}</CategoryTag>
          </InfoSection>
        </BookRow>

        {/* Tabs */}
        <TabsContainer>
          {["info", "review", "related"].map((tab) => (
            <TabButton key={tab} onPress={() => handleTabChange(tab as any)}>
              <TabText active={activeTab === tab}>
                {tab === "info"
                  ? "Thông tin"
                  : tab === "review"
                  ? "Nhận xét"
                  : "Liên quan"}
              </TabText>
            </TabButton>
          ))}
          <Animated.View
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              height: 3,
              borderRadius: 6,
              backgroundColor: "#2AA3AA",
              width: "33.33%", // mỗi tab chiếm 1/3 độ rộng
              transform: [
                {
                  translateX: underlineX.interpolate({
                    inputRange: [0, 1, 2],
                    outputRange: ["0%", "100%", "200%"], // chạy đều 3 tab
                  }),
                },
              ],
            }}
          />
        </TabsContainer>

        <Divider />

        {/* Nội dung từng tab */}
        <Animated.View style={{ opacity: fadeAnim }}>
          {activeTab === "info" && (
            <View>
              <InfoBlock>
                <InfoLabel>THỂ LOẠI</InfoLabel>
                <InfoValue>{bookDetail?.ten_the_loai}</InfoValue>
              </InfoBlock>
              <InfoBlock>
                <InfoLabel>NHÀ XUẤT BẢN</InfoLabel>
                <InfoValue>{bookDetail?.ten_nxb}</InfoValue>
              </InfoBlock>
              <InfoBlock>
                <InfoLabel>NGÀY XUẤT BẢN</InfoLabel>
                <InfoValue>
                  {isNaN(new Date(bookDetail?.nam_xuat_ban).getFullYear())
                    ? "N/A"
                    : new Date(bookDetail?.nam_xuat_ban).getFullYear()}
                </InfoValue>
              </InfoBlock>
              <InfoBlock>
                <InfoLabel>SỐ TRANG</InfoLabel>
                <InfoValue>
                  {isNaN(bookDetail?.so_trang) ? "N/A" : bookDetail?.so_trang}
                </InfoValue>
              </InfoBlock>
              <InfoBlock>
                <InfoLabel>NGÔN NGỮ</InfoLabel>
                <InfoValue>{bookDetail?.ten_ngon_ngu}</InfoValue>
              </InfoBlock>
              <InfoBlock>
                <InfoLabel>ISBN</InfoLabel>
                <InfoValue>{bookDetail?.ISBN}</InfoValue>
              </InfoBlock>
              <InfoBlock>
                <InfoLabel>MÔ TẢ</InfoLabel>
                <InfoValue>{bookDetail?.mo_ta}</InfoValue>
              </InfoBlock>
              <InfoBlock>
                <InfoLabel>NHÀ CUNG CẤP</InfoLabel>
                <InfoValue>{bookDetail?.ten_ncc}</InfoValue>
              </InfoBlock>
              <InfoBlock>
                <InfoLabel>KHU VỰC</InfoLabel>
                <InfoValue>{bookDetail?.ten_khu_vuc}</InfoValue>
              </InfoBlock>
              <InfoBlock>
                <InfoLabel>SỐ LƯỢNG CÒN</InfoLabel>
                <InfoValue>
                  {bookDetail?.so_luong_con > 0
                    ? bookDetail.so_luong_con
                    : "Sách đang hết"}
                </InfoValue>
              </InfoBlock>
              {bookDetail?.thong_tin_phu && (
                <View>
                  <InfoBlock>
                    <InfoLabel>NHAN ĐỀ PHỤ</InfoLabel>
                    <InfoValue>
                      {bookDetail.thong_tin_phu.nhan_de_phu}
                    </InfoValue>
                  </InfoBlock>
                  <InfoBlock>
                    <InfoLabel>SỐ CUTTER TÁC GIẢ</InfoLabel>
                    <InfoValue>
                      {bookDetail.thong_tin_phu.so_cutter_tac_gia}
                    </InfoValue>
                  </InfoBlock>
                  <InfoBlock>
                    <InfoLabel>PHÂN LOẠI TÀI LIỆU</InfoLabel>
                    <InfoValue>
                      {bookDetail.thong_tin_phu.phan_loai_tai_lieu}
                    </InfoValue>
                  </InfoBlock>
                  <InfoBlock>
                    <InfoLabel>LẦN TÁI BẢN</InfoLabel>
                    <InfoValue>
                      {bookDetail.thong_tin_phu.lan_tai_ban}
                    </InfoValue>
                  </InfoBlock>
                  <InfoBlock>
                    <InfoLabel>CHỦ ĐỀ</InfoLabel>
                    <InfoValue>{bookDetail.thong_tin_phu.chu_de}</InfoValue>
                  </InfoBlock>
                  <InfoBlock>
                    <InfoLabel>SỐ CHỨNG TỪ</InfoLabel>
                    <InfoValue>
                      {bookDetail.thong_tin_phu.so_chung_tu}
                    </InfoValue>
                  </InfoBlock>
                </View>
              )}
              {bookDetail?.file_dinh_kem &&
                bookDetail.file_dinh_kem.length > 0 && (
                  <InfoBlock>
                    <InfoLabel>FILE ĐÍNH KÈM</InfoLabel>
                    <TouchableOpacity onPress={openPDF}>
                      <InfoValue
                        style={{
                          color: "#2AA3AA",
                          textDecorationLine: "underline",
                        }}
                      >
                        {bookDetail.file_dinh_kem[0].ten_file}
                      </InfoValue>
                    </TouchableOpacity>
                  </InfoBlock>
                )}
            </View>
          )}

          {activeTab === "review" && (
            <>
              <TouchableOpacity
                style={{
                  alignSelf: "flex-end",
                  marginBottom: 12,
                  marginRight: 16,
                }}
                onPress={() => setAddModalVisible(true)}
              >
                <Ionicons name="add-circle" size={28} color="#2AA3AA" />
              </TouchableOpacity>

              {reviews.map((r) => (
                <TouchableOpacity
                  key={r.ma_danh_gia}
                  onPress={() => setSelectedReview(r)}
                  style={{
                    backgroundColor: "#f9f9f9",
                    borderRadius: 10,
                    padding: 12,
                    marginBottom: 12,
                    marginHorizontal: 10,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <InfoLabel>Người dùng {r.ho_ten || "Unknown"}</InfoLabel>
                    <StarsRow>{renderStars(r.diem || 0)}</StarsRow>
                  </View>
                  <InfoValue numberOfLines={2}>{r.binh_luan || ""}</InfoValue>
                </TouchableOpacity>
              ))}
            </>
          )}

          {activeTab === "related" && (
            <FlatList
              data={relatedBooks}
              horizontal
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={{
                    width: 130,
                    marginHorizontal: 10,
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      width: 120,
                      height: 170,
                      borderRadius: 12,
                      overflow: "hidden",
                      marginBottom: 6,
                    }}
                  >
                    <CoverImage source={{ uri: item.thumb }} />
                  </View>
                  <InfoLabel
                    numberOfLines={2}
                    style={{ fontSize: 13, textAlign: "center" }}
                  >
                    {item.title}
                  </InfoLabel>
                  <InfoValue style={{ fontSize: 12, color: "#2AA3AA" }}>
                    {item.author}
                  </InfoValue>
                </TouchableOpacity>
              )}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ padding: 10 }}
            />
          )}
        </Animated.View>
      </ScrollView>

      {/* Nút dưới */}
      <BottomButtons>
        <WishlistButton
          onPress={handleWishlistToggle}
          disabled={wishlistLoading}
          style={wishlistLoading ? { opacity: 0.5 } : {}}
        >
          <Ionicons
            name={isInWishlist ? "heart" : "heart-outline"}
            size={18}
            color="#fff"
          />
          <ButtonText>
            {isInWishlist ? "Đã thêm" : "Thêm vào wishlist"}
          </ButtonText>
        </WishlistButton>
        <ShelfButton
          onPress={bookDetail?.so_luong_con > 0 ? handleBorrowBook : undefined}
          disabled={bookDetail?.so_luong_con <= 0}
          style={bookDetail?.so_luong_con <= 0 ? { opacity: 0.5 } : {}}
        >
          <Ionicons name="library-outline" size={18} color="#2AA3AA" />
          <ButtonText style={{ color: "#2AA3AA" }}>
            {bookDetail?.so_luong_con > 0 ? "Đặt mượn" : "Hết sách"}
          </ButtonText>
        </ShelfButton>
      </BottomButtons>

      {/* Floating PDF Button */}
      <TouchableOpacity
        onPress={openPDF}
        style={{
          position: "absolute",
          bottom: 140,
          right: 20,
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

      {/* Modal xem chi tiết nhận xét */}
      <Modal
        visible={!!selectedReview}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedReview(null)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.4)",
            justifyContent: "center",
            alignItems: "center",
            padding: 24,
          }}
        >
          <View
            style={{
              backgroundColor: "#fff",
              borderRadius: 12,
              padding: 20,
              width: "100%",
            }}
          >
            <InfoLabel style={{ fontSize: 16, marginBottom: 8 }}>
              Người dùng {selectedReview?.ho_ten || "Unknown"}
            </InfoLabel>
            <StarsRow>{renderStars(selectedReview?.diem || 0)}</StarsRow>
            <InfoValue style={{ marginTop: 10 }}>
              {selectedReview?.binh_luan || ""}
            </InfoValue>
            <TouchableOpacity
              onPress={() => setSelectedReview(null)}
              style={{
                alignSelf: "flex-end",
                marginTop: 20,
                backgroundColor: "#2AA3AA",
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 8,
              }}
            >
              <ButtonText style={{ color: "#fff" }}>Đóng</ButtonText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal thêm nhận xét */}
      <Modal
        visible={addModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setAddModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.3)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              backgroundColor: "#fff",
              borderRadius: 12,
              padding: 20,
              width: "90%",
            }}
          >
            <InfoLabel>Họ tên</InfoLabel>
            <TextInput
              placeholder="Nhập họ tên..."
              value={newReview.name}
              onChangeText={(t) => setNewReview({ ...newReview, name: t })}
              style={{
                borderWidth: 1,
                borderColor: "#ddd",
                borderRadius: 8,
                padding: 8,
                marginBottom: 12,
              }}
            />
            <InfoLabel>Nội dung</InfoLabel>
            <TextInput
              placeholder="Viết nhận xét của bạn..."
              value={newReview.content}
              onChangeText={(t) => setNewReview({ ...newReview, content: t })}
              multiline
              style={{
                borderWidth: 1,
                borderColor: "#ddd",
                borderRadius: 8,
                padding: 8,
                minHeight: 80,
                textAlignVertical: "top",
                marginBottom: 12,
              }}
            />
            <InfoLabel>Đánh giá</InfoLabel>
            <View style={{ flexDirection: "row", marginVertical: 8 }}>
              {renderStars(newReview.stars, true)}
            </View>
            <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
              <TouchableOpacity
                onPress={() => setAddModalVisible(false)}
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  marginRight: 8,
                }}
              >
                <ButtonText>Hủy</ButtonText>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleAddReview}
                style={{
                  backgroundColor: "#2AA3AA",
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 8,
                }}
              >
                <ButtonText style={{ color: "#fff" }}>Gửi</ButtonText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Menu Modal */}
      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.3)",
            justifyContent: "flex-start",
            alignItems: "flex-end",
            paddingTop: 60,
            paddingRight: 20,
          }}
          onPress={() => setMenuVisible(false)}
        >
          <View
            style={{
              backgroundColor: "#fff",
              borderRadius: 12,
              padding: 20,
              width: 200,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                shareBook();
                setMenuVisible(false);
              }}
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: 12,
              }}
            >
              <Ionicons name="share-outline" size={20} color="#2AA3AA" />
              <InfoValue style={{ marginLeft: 12 }}>Chia sẻ</InfoValue>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setPdfModalVisible(true);
                setMenuVisible(false);
              }}
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: 12,
              }}
            >
              <Ionicons name="document-outline" size={20} color="#2AA3AA" />
              <InfoValue style={{ marginLeft: 12 }}>Xem PDF</InfoValue>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* PDF Modal */}
      <Modal
        visible={pdfModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setPdfModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.8)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              backgroundColor: "#fff",
              borderRadius: 12,
              padding: 20,
              width: "90%",
              height: "80%",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <InfoLabel style={{ fontSize: 18 }}>PDF Viewer</InfoLabel>
              <TouchableOpacity onPress={() => setPdfModalVisible(false)}>
                <Ionicons name="close" size={24} color="#2AA3AA" />
              </TouchableOpacity>
            </View>
            <View style={{ flex: 1 }}>
              {bookDetail?.file_dinh_kem &&
              bookDetail.file_dinh_kem.length > 0 ? (
                <WebView
                  source={{ uri: bookDetail.file_dinh_kem[0].duong_dan }}
                  style={{ flex: 1 }}
                />
              ) : (
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <InfoValue>Không có file PDF để hiển thị</InfoValue>
                </View>
              )}
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                marginTop: 10,
              }}
            >
              <TouchableOpacity
                onPress={prevPage}
                style={{
                  backgroundColor: "#2AA3AA",
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 8,
                  marginRight: 10,
                }}
              >
                <ButtonText style={{ color: "#fff" }}>Trước</ButtonText>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={nextPage}
                style={{
                  backgroundColor: "#2AA3AA",
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 8,
                }}
              >
                <ButtonText style={{ color: "#fff" }}>Sau</ButtonText>
              </TouchableOpacity>
            </View>
            <InfoValue style={{ textAlign: "center", marginTop: 10 }}>
              Trang {currentPage + 1}
            </InfoValue>
          </View>
        </View>
      </Modal>
    </Container>
  );
};

export default BookDetailScreen;
