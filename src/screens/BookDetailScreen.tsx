import React, { useState } from "react";
import { FlatList, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  Container,
  Header,
  BackButton,
  HeaderTitle,
  CoverImage,
  InfoCard,
  BookTitle,
  BookAuthor,
  StarsRow,
  TabContainer,
  TabButton,
  TabText,
  TabUnderline,
  ContentBox,
  Label,
  Description,
  ReviewCard,
  ReviewHeader,
  ReviewUser,
  ReviewDate,
  ReviewText,
  RelatedCard,
  RelatedImage,
  RelatedTitle,
  RelatedAuthor,
} from "../styles/BookDetailScreen.style";

interface Book {
  id: number;
  title: string;
  author: string;
  thumb: string;
}

const BookDetailScreen: React.FC<any> = ({ route, navigation }) => {
  const { book } = route.params || {};
  const [activeTab, setActiveTab] = useState<"info" | "reviews" | "related">(
    "info"
  );

  const relatedBooks: Book[] = [
    {
      id: 1,
      title: "Đấu Phá Thương Khung",
      author: "Thiên Tàm Thổ Đậu",
      thumb: "https://picsum.photos/200/300?random=21",
    },
    {
      id: 2,
      title: "Vạn Cổ Thần Đế",
      author: "Phong Hỏa Hí Chư Hầu",
      thumb: "https://picsum.photos/200/300?random=22",
    },
    {
      id: 3,
      title: "Tiên Nghịch",
      author: "Nhĩ Căn",
      thumb: "https://picsum.photos/200/300?random=23",
    },
  ];

  const reviews = [
    {
      id: 1,
      user: "longnhan_99",
      rating: 5,
      content: "Tác phẩm quá tuyệt vời, đọc cuốn hút từ đầu đến cuối!",
      date: "2 ngày trước",
    },
    {
      id: 2,
      user: "thienvuong",
      rating: 4,
      content: "Truyện khá ổn, nội dung hấp dẫn, chờ phần tiếp theo.",
      date: "1 tuần trước",
    },
  ];

  const renderStars = (count: number) =>
    Array.from({ length: 5 }).map((_, i) => (
      <Ionicons
        key={i}
        name={i < count ? "star" : "star-outline"}
        size={18}
        color="#FFD700"
      />
    ));

  const renderRelated = ({ item }: { item: Book }) => (
    <RelatedCard onPress={() => navigation.push("BookDetail", { book: item })}>
      <RelatedImage source={{ uri: item.thumb }} />
      <RelatedTitle numberOfLines={2}>{item.title}</RelatedTitle>
      <RelatedAuthor>{item.author}</RelatedAuthor>
    </RelatedCard>
  );

  return (
    <Container>
      <Header>
        <BackButton onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </BackButton>
        <HeaderTitle>Chi tiết sách</HeaderTitle>
      </Header>

      <ScrollView showsVerticalScrollIndicator={false}>
        <CoverImage source={{ uri: book.thumb }} />
        <InfoCard>
          <BookTitle>{book.title}</BookTitle>
          <BookAuthor>{book.author}</BookAuthor>
          <StarsRow>{renderStars(4)}</StarsRow>
        </InfoCard>

        <TabContainer>
          {[
            { key: "info", label: "Giới thiệu" },
            { key: "reviews", label: "Nhận xét" },
            { key: "related", label: "Liên quan" },
          ].map((tab) => (
            <TabButton
              key={tab.key}
              onPress={() => setActiveTab(tab.key as any)}
            >
              <TabText active={activeTab === tab.key}>{tab.label}</TabText>
              {activeTab === tab.key && <TabUnderline />}
            </TabButton>
          ))}
        </TabContainer>

        <ContentBox>
          {activeTab === "info" && (
            <>
              <Label>Giới thiệu</Label>
              <Description>
                {book.title} là một tác phẩm nổi bật trong thể loại tiên hiệp,
                mang đến thế giới tu luyện huyền ảo cùng những trận chiến gay
                cấn, cảm động và sâu sắc.
              </Description>
            </>
          )}

          {activeTab === "reviews" &&
            reviews.map((r) => (
              <ReviewCard key={r.id}>
                <ReviewHeader>
                  <ReviewUser>{r.user}</ReviewUser>
                  <ReviewDate>{r.date}</ReviewDate>
                </ReviewHeader>
                <StarsRow>{renderStars(r.rating)}</StarsRow>
                <ReviewText>{r.content}</ReviewText>
              </ReviewCard>
            ))}

          {activeTab === "related" && (
            <FlatList
              data={relatedBooks}
              renderItem={renderRelated}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
            />
          )}
        </ContentBox>
      </ScrollView>
    </Container>
  );
};

export default BookDetailScreen;
