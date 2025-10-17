import React, { useState } from "react";
import {
  Animated,
  Easing,
  ScrollView,
  Modal,
  View,
  TouchableOpacity,
  TextInput,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
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
  const [activeTab, setActiveTab] = useState<"info" | "review" | "related">(
    "info"
  );
  const [fadeAnim] = useState(new Animated.Value(1));
  const [underlineX] = useState(new Animated.Value(0));

  const [selectedReview, setSelectedReview] = useState<any>(null);
  const [addModalVisible, setAddModalVisible] = useState(false);

  const [newReview, setNewReview] = useState({
    name: "",
    content: "",
    stars: 0,
  });

  const [reviews, setReviews] = useState([
    {
      id: 1,
      name: "Nguyễn Văn A",
      stars: 5,
      short: "Sách rất hay và tạo động lực.",
      detail:
        "Tôi đọc xong quyển này cảm thấy có thêm động lực để thay đổi bản thân. Cách viết dễ hiểu, ví dụ thực tế và gần gũi.",
    },
    {
      id: 2,
      name: "Trần Thị B",
      stars: 4,
      short: "Nội dung hữu ích nhưng hơi dài.",
      detail:
        "Sách trình bày tốt, có nhiều bài học giá trị. Tuy nhiên phần giữa hơi lan man. Dù sao vẫn rất đáng đọc!",
    },
  ]);

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

  const renderStars = (count: number, editable = false) =>
    Array.from({ length: 5 }).map((_, i) => (
      <Ionicons
        key={i}
        name={i < count ? "star" : "star-outline"}
        size={18}
        color="#FFD700"
        style={{ marginHorizontal: 1 }}
        onPress={() => editable && setNewReview({ ...newReview, stars: i + 1 })}
      />
    ));

  return (
    <Container>
      <Header>
        <BackButton onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color="#2AA3AA" />
        </BackButton>
      </Header>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false} // ẩn thanh cuộn dọc
      >
        {/* Ảnh & thông tin */}
        <BookRow>
          <CoverImage
            source={{ uri: "https://picsum.photos/200/300?random=30" }}
          />
          <InfoSection>
            <BookTitle>The Let Them Theory</BookTitle>
            <BookAuthor>Robbins, Mel</BookAuthor>
            <StarsRow>{renderStars(5)}</StarsRow>
            <RatingText>(224)</RatingText>
            <CategoryTag>Success Self-Help</CategoryTag>
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
            <>
              <InfoBlock>
                <InfoLabel>THỂ LOẠI</InfoLabel>
                <InfoValue>
                  Success Self-Help, Business Motivation & Self-Improvement,
                  Motivational Management & Leadership
                </InfoValue>
              </InfoBlock>
              <InfoBlock>
                <InfoLabel>NHÀ XUẤT BẢN</InfoLabel>
                <InfoValue>Hay House LLC</InfoValue>
              </InfoBlock>
              <InfoBlock>
                <InfoLabel>NGÀY XUẤT BẢN</InfoLabel>
                <InfoValue>2024-12-31</InfoValue>
              </InfoBlock>
              <InfoBlock>
                <InfoLabel>SỐ TRANG</InfoLabel>
                <InfoValue>336</InfoValue>
              </InfoBlock>
              <InfoBlock>
                <InfoLabel>ĐỊNH DẠNG</InfoLabel>
                <InfoValue>Bìa cứng</InfoValue>
              </InfoBlock>
              <InfoBlock>
                <InfoLabel>ISBN</InfoLabel>
                <InfoValue>9781401971366</InfoValue>
              </InfoBlock>
            </>
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
                  key={r.id}
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
                    <InfoLabel>{r.name}</InfoLabel>
                    <StarsRow>{renderStars(r.stars)}</StarsRow>
                  </View>
                  <InfoValue numberOfLines={2}>{r.short}</InfoValue>
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
        <WishlistButton>
          <Ionicons name="heart-outline" size={18} color="#fff" />
          <ButtonText>Thêm vào wishlist</ButtonText>
        </WishlistButton>
        <ShelfButton>
          <Ionicons name="library-outline" size={18} color="#2AA3AA" />
          <ButtonText style={{ color: "#2AA3AA" }}>Thêm vào kệ sách</ButtonText>
        </ShelfButton>
      </BottomButtons>

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
              {selectedReview?.name}
            </InfoLabel>
            <StarsRow>{renderStars(selectedReview?.stars || 0)}</StarsRow>
            <InfoValue style={{ marginTop: 10 }}>
              {selectedReview?.detail}
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
    </Container>
  );
};

export default BookDetailScreen;
