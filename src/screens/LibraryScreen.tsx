import React, { useRef, useEffect, useState } from "react";
import { Platform } from "react-native";
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  Animated,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
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

const mockSmall = new Array(8).fill(0).map((_, i) => ({
  id: i + 1,
  title: i % 2 === 0 ? "Nhân Tại Cao Tam, Hệ Thống..." : "Trần Vấn Trường Sinh",
  img: `https://picsum.photos/200/300?random=${i + 10}`,
}));

const recommended = [
  {
    id: 1,
    title: "Sống Sót Trong Trò Chơi Với Tư Cách Một Barbarian",
    thumb: "https://picsum.photos/80/120?rc1",
    status: "Tình trạng: Đang ra",
    chapters: "Số chương: 670",
  },
  {
    id: 2,
    title: "Ngày Hôm Nay Cũng Đang Cố Gắng Làm Ma Đầu",
    thumb: "https://picsum.photos/80/120?rc2",
    status: "Tình trạng: Đang ra",
    chapters: "Số chương: 238",
  },
  {
    id: 3,
    title: "Tôi Là Một Con Ma, Nhưng Tôi Muốn Làm Người",
    thumb: "https://picsum.photos/80/120?rc3",
    status: "Tình trạng: Đang ra",
    chapters: "Số chương: 450",
  },
  {
    id: 4,
    title: "Hành Trình Của Một Kiếm Khách",
    thumb: "https://picsum.photos/80/120?rc4",
    status: "Tình trạng: Đang ra",
    chapters: "Số chương: 320",
  },
];

const mostViewed = [
  {
    id: 1,
    title: "Vũ Động Càn Khôn",
    thumb: "https://picsum.photos/80/120?mv1",
    status: "Tình trạng: Đang ra",
    chapters: "Số chương: 1200",
  },
  {
    id: 2,
    title: "Đấu La Đại Lục",
    thumb: "https://picsum.photos/80/120?mv2",
    status: "Tình trạng: Đang ra",
    chapters: "Số chương: 890",
  },
  {
    id: 3,
    title: "Thần Ấn Vương Tọa",
    thumb: "https://picsum.photos/80/120?mv3",
    status: "Tình trạng: Đang ra",
    chapters: "Số chương: 750",
  },
  {
    id: 4,
    title: "Ngạo Thế Độc Tôn",
    thumb: "https://picsum.photos/80/120?mv4",
    status: "Tình trạng: Đang ra",
    chapters: "Số chương: 680",
  },
];

export default function LibraryScreen() {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  // dot indicator sync on manual swipe
  const onScroll = (e: any) => {
    const x = e.nativeEvent.contentOffset.x;
    const newIdx = Math.round(x / width);
    if (newIdx !== index) setIndex(newIdx);
  };

  // fade-in for small cards
  const fadeAnims = useRef(mockSmall.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    // Reset animations to avoid native driver conflict
    fadeAnims.forEach((anim) => anim.setValue(0));
    const seq = mockSmall.map((_, i) =>
      Animated.timing(fadeAnims[i], {
        toValue: 1,
        duration: 600,
        delay: i * 100,
        useNativeDriver: false,
      })
    );
    Animated.stagger(80, seq).start();
  }, []);

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
              {banners.map((b, i) => (
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

          {/* icon bar (flat icons, no shadows) */}
          <IconBar>
            <IconItem activeOpacity={0.7}>
              <Ionicons name="grid-outline" size={28} color="#2aa3a3" />
              <IconLabel>Thể loại</IconLabel>
            </IconItem>

            <IconItem activeOpacity={0.7}>
              <Ionicons name="bar-chart-outline" size={28} color="#2aa3a3" />
              <IconLabel>Xếp hạng</IconLabel>
            </IconItem>

            <IconItem activeOpacity={0.7}>
              <Ionicons name="filter-outline" size={28} color="#2aa3a3" />
              <IconLabel>Bộ lọc</IconLabel>
            </IconItem>

            <IconItem activeOpacity={0.7}>
              <Ionicons name="book-outline" size={28} color="#2aa3a3" />
              <IconLabel>Tin tức</IconLabel>
            </IconItem>
          </IconBar>

          {/* Section: Truyện mới cập nhật (horizontal small cards) */}
          {/* Section: Truyện mới cập nhật */}
          <SectionBlock>
            <SectionHeader>
              <SectionTitle>TRUYỆN MỚI CẬP NHẬT</SectionTitle>
              <SeeMore>Xem thêm &gt;</SeeMore>
            </SectionHeader>

            <RowHorizontal horizontal showsHorizontalScrollIndicator={false}>
              {mockSmall.map((b, i) => (
                <Animated.View
                  key={b.id}
                  style={{ opacity: fadeAnims[i], marginRight: 12 }}
                >
                  <SmallCard activeOpacity={0.85}>
                    <SmallCover source={{ uri: b.img }} />
                    <SmallTitle numberOfLines={2}>{b.title}</SmallTitle>
                  </SmallCard>
                </Animated.View>
              ))}
            </RowHorizontal>
          </SectionBlock>

          {/* Section: Truyện đề cử (list style with small thumb left) */}
          {/* Section: Truyện đề cử */}
          <ListBlock>
            <SectionHeader>
              <SectionTitle>TRUYỆN ĐỀ CỬ</SectionTitle>
              <SeeMore>Xem thêm &gt;</SeeMore>
            </SectionHeader>

            {recommended.map((r) => (
              <ListItem key={r.id} activeOpacity={0.85}>
                <ListThumb source={{ uri: r.thumb }} />
                <ListContent>
                  <ListTitle numberOfLines={2}>{r.title}</ListTitle>
                  <ListMeta>{r.status}</ListMeta>
                  <ListMeta>{r.chapters}</ListMeta>
                </ListContent>
              </ListItem>
            ))}
          </ListBlock>

          {/* Section: Truyện mới (horizontal small cards) */}
          <SectionBlock>
            <SectionHeader>
              <SectionTitle>TRUYỆN MỚI</SectionTitle>
              <SeeMore>Xem thêm </SeeMore>
            </SectionHeader>

            <RowHorizontal horizontal showsHorizontalScrollIndicator={false}>
              {mockSmall.map((b, i) => (
                <Animated.View
                  key={`new-${b.id}`}
                  style={{ opacity: fadeAnims[i], marginRight: 12 }}
                >
                  <SmallCard activeOpacity={0.85}>
                    <SmallCover source={{ uri: b.img }} />
                    <SmallTitle numberOfLines={2}>{b.title}</SmallTitle>
                  </SmallCard>
                </Animated.View>
              ))}
            </RowHorizontal>
          </SectionBlock>

          {/* Section: Truyện xem nhiều (list style with small thumb left) */}
          <ListBlock>
            <SectionHeader>
              <SectionTitle>TRUYỆN XEM NHIỀU</SectionTitle>
              <SeeMore>Xem thêm</SeeMore>
            </SectionHeader>

            {mostViewed.map((r) => (
              <ListItem key={r.id} activeOpacity={0.85}>
                <ListThumb source={{ uri: r.thumb }} />
                <ListContent>
                  <ListTitle numberOfLines={2}>{r.title}</ListTitle>
                  <ListMeta>{r.status}</ListMeta>
                  <ListMeta>{r.chapters}</ListMeta>
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
