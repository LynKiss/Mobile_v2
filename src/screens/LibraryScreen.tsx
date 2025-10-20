import React, { useRef, useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  Dimensions,
  Animated,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { API_URL } from "../Api/config";
import {
  Container,
  Header,
  Title,
  SearchButton,
  BannerWrap,
  BannerImage,
  DotsRow,
  Dot,
  IconBar,
  IconItem,
  IconLabel,
  SectionHeader,
  SectionTitle,
  SeeMore,
  SectionBlock,
  RowHorizontal,
  SmallCard,
  SmallCover,
  SmallTitle,
  ListItem,
  ListThumb,
  ListContent,
  ListTitle,
  ListMeta,
  ListBlock,
} from "../styles/LibraryScreen.style";

const { width } = Dimensions.get("window");

const banners = [
  { id: 1, title: "QUỶ BÍ CHI CHỦ", img: "https://picsum.photos/900/400?1" },
  {
    id: 2,
    title: "THIÊN MỆNH NGỰ THÚ",
    img: "https://picsum.photos/900/400?2",
  },
  {
    id: 3,
    title: "HOGWARTS CHI QUY ĐỒ",
    img: "https://picsum.photos/900/400?3",
  },
  { id: 4, title: "GIÁ NHẤT THẾ", img: "https://picsum.photos/900/400?4" },
];

export default function LibraryScreen() {
  const navigation = useNavigation();
  const [books, setBooks] = useState([]);
  const [newBooks, setNewBooks] = useState([]);
  const [recommendedBooks, setRecommendedBooks] = useState([]);
  const [mostViewedBooks, setMostViewedBooks] = useState([]);
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  // banner auto-slide
  const scrollRef = useRef<ScrollView | null>(null);
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const iv = setInterval(() => {
      const next = (index + 1) % banners.length;
      scrollRef.current?.scrollTo({ x: next * width, animated: true });
      setIndex(next);
    }, 3500);
    return () => clearInterval(iv);
  }, [index]);

  // dot indicator sync
  const onScroll = (e: any) => {
    const x = e.nativeEvent.contentOffset.x;
    const newIdx = Math.round(x / width);
    if (newIdx !== index) setIndex(newIdx);
  };

  // Load dữ liệu từ 4 API endpoints riêng biệt
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Sách mới cập nhật
        const newBooksRes = await fetch(`${API_URL}/api/sach/new`);
        if (newBooksRes.ok) {
          const text = await newBooksRes.text();
          if (text) {
            const newBooksData = JSON.parse(text);
            setNewBooks(newBooksData.data || []);
          } else {
            console.error("Empty response for new books");
          }
        } else {
          console.error(
            "Failed to fetch new books:",
            newBooksRes.status,
            await newBooksRes.text()
          );
        }

        // Sách đề cử (sử dụng tất cả sách, giới hạn 5 cuốn)
        const recommendedRes = await fetch(`${API_URL}/api/sach`);
        if (recommendedRes.ok) {
          const text = await recommendedRes.text();
          if (text) {
            const recommendedData = JSON.parse(text);
            setRecommendedBooks((recommendedData.data || []).slice(0, 5));
          } else {
            console.error("Empty response for recommended books");
          }
        } else {
          console.error(
            "Failed to fetch recommended books:",
            recommendedRes.status,
            await recommendedRes.text()
          );
        }

        // Sách xem nhiều nhất
        const mostViewedRes = await fetch(`${API_URL}/api/sach/most-borrowed`);
        if (mostViewedRes.ok) {
          const text = await mostViewedRes.text();
          if (text) {
            const mostViewedData = JSON.parse(text);
            setMostViewedBooks(mostViewedData.data || []);
          } else {
            console.error("Empty response for most viewed books");
          }
        } else {
          console.error(
            "Failed to fetch most viewed books:",
            mostViewedRes.status,
            await mostViewedRes.text()
          );
        }

        // Sách nổi bật
        const featuredRes = await fetch(`${API_URL}/api/sach/noibat`);
        if (featuredRes.ok) {
          const text = await featuredRes.text();
          if (text) {
            const featuredData = JSON.parse(text);
            setFeaturedBooks(featuredData.data || []);
          } else {
            console.error("Empty response for featured books");
          }
        } else {
          console.error(
            "Failed to fetch featured books:",
            featuredRes.status,
            await featuredRes.text()
          );
        }
      } catch (error) {
        console.error("Lỗi tải dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // fade-in animation - create animations dynamically to avoid length mismatch
  const [fadeAnims, setFadeAnims] = useState<Animated.Value[]>([]);
  useEffect(() => {
    if (newBooks.length > 0) {
      const newAnims = newBooks.map(() => new Animated.Value(0));
      setFadeAnims(newAnims);

      // Start animation after a brief delay
      setTimeout(() => {
        const seq = newAnims.map((anim, i) =>
          Animated.timing(anim, {
            toValue: 1,
            duration: 600,
            delay: i * 100,
            useNativeDriver: false,
          })
        );
        Animated.stagger(80, seq).start();
      }, 100);
    }
  }, [newBooks]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <Container>
        <Header>
          <View style={{ width: 40 }} />
          <Title>Thư viện</Title>
          <SearchButton activeOpacity={0.7}>
            <Ionicons name="search-outline" size={22} color="#222" />
          </SearchButton>
        </Header>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Banner carousel */}
          <BannerWrap>
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              ref={(r: any) => (scrollRef.current = r)}
              onMomentumScrollEnd={onScroll}
            >
              {banners.map((b) => (
                <View key={b.id} style={{ width }}>
                  <BannerImage source={{ uri: b.img }} resizeMode="cover" />
                  <LinearGradient
                    colors={["transparent", "rgba(0,0,0,0.55)"]}
                    style={{
                      position: "absolute",
                      left: 0,
                      right: 0,
                      bottom: 0,
                      height: 90,
                    }}
                  />
                  <View style={{ position: "absolute", left: 16, bottom: 16 }}>
                    <Text style={styles.bannerTitle}>{b.title}</Text>
                  </View>
                </View>
              ))}
            </ScrollView>

            <DotsRow>
              {banners.map((_, i) => (
                <Dot key={i} active={i === index} />
              ))}
            </DotsRow>
          </BannerWrap>

          {/* Icon bar */}
          <IconBar>
            <IconItem key="categories">
              <Ionicons name="grid-outline" size={28} color="#2aa3a3" />
              <IconLabel>Thể loại</IconLabel>
            </IconItem>
            <IconItem key="ranking">
              <Ionicons name="bar-chart-outline" size={28} color="#2aa3a3" />
              <IconLabel>Xếp hạng</IconLabel>
            </IconItem>
            <IconItem key="filter">
              <Ionicons name="filter-outline" size={28} color="#2aa3a3" />
              <IconLabel>Bộ lọc</IconLabel>
            </IconItem>
            <IconItem key="news">
              <Ionicons name="book-outline" size={28} color="#2aa3a3" />
              <IconLabel>Tin tức</IconLabel>
            </IconItem>
          </IconBar>

          {/* Section: Sách mới cập nhật */}
          <SectionBlock>
            <SectionHeader>
              <SectionTitle>SÁCH MỚI CẬP NHẬT</SectionTitle>
              <SeeMore>Xem thêm {">"}</SeeMore>
            </SectionHeader>
            <RowHorizontal horizontal showsHorizontalScrollIndicator={false}>
              {newBooks.map((book: any, i) => (
                <Animated.View
                  key={book.ma_sach || `new-${i}`}
                  style={{ opacity: fadeAnims[i] || 1, marginRight: 12 }}
                >
                  <SmallCard
                    activeOpacity={0.85}
                    onPress={() =>
                      (navigation as any).navigate("BookDetail", {
                        ma_sach: book.ma_sach,
                      })
                    }
                  >
                    <SmallCover
                      source={{
                        uri:
                          book.hinh_bia ||
                          "https://picsum.photos/200/300?random",
                      }}
                    />
                    <SmallTitle numberOfLines={2}>{book.tieu_de}</SmallTitle>
                  </SmallCard>
                </Animated.View>
              ))}
            </RowHorizontal>
          </SectionBlock>

          {/* Section: Sách đề cử */}
          <ListBlock>
            <SectionHeader>
              <SectionTitle>SÁCH ĐỀ CỬ</SectionTitle>
              <SeeMore>Xem thêm {">"}</SeeMore>
            </SectionHeader>

            {recommendedBooks.map((book: any, i) => (
              <ListItem
                key={book.ma_sach || `recommended-${i}`}
                activeOpacity={0.85}
                onPress={() =>
                  (navigation as any).navigate("BookDetail", { book })
                }
              >
                <ListThumb
                  source={{
                    uri: book.hinh_bia || "https://picsum.photos/80/120?random",
                  }}
                />
                <ListContent>
                  <ListTitle numberOfLines={2}>{book.tieu_de}</ListTitle>
                  <ListMeta>Tác giả: {book.tac_gia}</ListMeta>
                  <ListMeta>Thể loại: {book.ten_the_loai}</ListMeta>
                </ListContent>
              </ListItem>
            ))}
          </ListBlock>

          {/* Section: Sách nổi bật */}
          <SectionBlock>
            <SectionHeader>
              <SectionTitle>SÁCH NỔI BẬT</SectionTitle>
              <SeeMore>Xem thêm {">"}</SeeMore>
            </SectionHeader>
            <RowHorizontal horizontal showsHorizontalScrollIndicator={false}>
              {featuredBooks.map((book: any, i) => (
                <Animated.View
                  key={`featured-${book.ma_sach || i}`}
                  style={{ opacity: fadeAnims[i] || 1, marginRight: 12 }}
                >
                  <SmallCard
                    activeOpacity={0.85}
                    onPress={() =>
                      (navigation as any).navigate("BookDetail", { book })
                    }
                  >
                    <SmallCover
                      source={{
                        uri:
                          book.hinh_bia ||
                          "https://picsum.photos/200/300?random",
                      }}
                    />
                    <SmallTitle numberOfLines={2}>{book.tieu_de}</SmallTitle>
                  </SmallCard>
                </Animated.View>
              ))}
            </RowHorizontal>
          </SectionBlock>

          {/* Section: Sách xem nhiều */}
          <ListBlock>
            <SectionHeader>
              <SectionTitle>SÁCH XEM NHIỀU</SectionTitle>
              <SeeMore>Xem thêm {">"}</SeeMore>
            </SectionHeader>

            {mostViewedBooks.map((book: any, i) => (
              <ListItem
                key={book.ma_sach || `mostViewed-${i}`}
                activeOpacity={0.85}
                onPress={() =>
                  (navigation as any).navigate("BookDetail", { book })
                }
              >
                <ListThumb
                  source={{
                    uri: book.hinh_bia || "https://picsum.photos/80/120?random",
                  }}
                />
                <ListContent>
                  <ListTitle numberOfLines={2}>{book.tieu_de}</ListTitle>
                  <ListMeta>Tác giả: {book.tac_gia}</ListMeta>
                  <ListMeta>Lượt mượn: {book.luot_muon || "N/A"}</ListMeta>
                </ListContent>
              </ListItem>
            ))}
          </ListBlock>

          <View style={{ height: 80 }} />
        </ScrollView>
      </Container>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  bannerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});
