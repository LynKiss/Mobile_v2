import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
  useMemo,
} from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  RefreshControl,
  FlatList,
  Animated,
  Dimensions,
  ScrollView,
  LayoutChangeEvent,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useNavigation } from "@react-navigation/native";
import styles from "../styles/BookScreens.style";

const { width } = Dimensions.get("window");

const categories = [
  "Tất cả",
  "Huyền Huyễn",
  "Tiên Hiệp",
  "Đô Thị",
  "Trọng Sinh",
  "Hệ Thống",
  "Võng Du",
  "Cổ Đại",
];

const books = new Array(12).fill(0).map((_, i) => ({
  id: i + 1,
  title:
    i % 2 === 0
      ? "Đấu Phá Thương Khung"
      : "Vạn Cổ Thần Đế – Phong Hỏa Hí Chư Hầu",
  author: "Thiên Tàm Thổ Đậu",
  thumb: `https://picsum.photos/200/300?random=${i + 10}`,
}));

export default function BookScreens() {
  const navigation = useNavigation();
  const [activeCategory, setActiveCategory] = useState(0);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [refreshing, setRefreshing] = useState(false);
  const [tabLayouts, setTabLayouts] = useState<{ x: number; width: number }[]>(
    []
  );

  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList>(null);
  const scrollRef = useRef<ScrollView>(null);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const toggleView = () => {
    setViewMode((prev) => (prev === "list" ? "grid" : "list"));
  };

  // lưu layout từng tab
  const onTabLayout = (index: number, e: LayoutChangeEvent) => {
    const { x, width } = e.nativeEvent.layout;
    setTabLayouts((prev) => {
      const copy = [...prev];
      copy[index] = { x, width };
      return copy;
    });
  };

  // căn giữa tab khi vuốt / chọn
  const centerActiveTab = (index: number) => {
    if (!tabLayouts[index]) return;
    const { x, width: tabWidth } = tabLayouts[index];
    const offset = x + tabWidth / 2 - width / 2;
    scrollRef.current?.scrollTo({ x: Math.max(0, offset), animated: true });
  };

  const handleCategoryPress = (index: number) => {
    flatListRef.current?.scrollToOffset({
      offset: index * width,
      animated: true,
    });
    setActiveCategory(index);
    centerActiveTab(index);
  };

  const onScrollEnd = (e: any) => {
    const newIndex = Math.round(e.nativeEvent.contentOffset.x / width);
    setActiveCategory(newIndex);
    centerActiveTab(newIndex);
  };

  const renderBookItem = ({ item }: any) => {
    const handlePress = () => {
      (navigation as any).navigate("BookDetail", { book: item });
    };

    if (viewMode === "list") {
      return (
        <TouchableOpacity onPress={handlePress} style={styles.listItem}>
          <Image source={{ uri: item.thumb }} style={styles.listImage} />
          <View style={styles.listContent}>
            <Text style={styles.bookTitle} numberOfLines={2}>
              {item.title}
            </Text>
            <Text style={styles.bookAuthor}>{item.author}</Text>
          </View>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity onPress={handlePress} style={styles.gridItem}>
        <Image source={{ uri: item.thumb }} style={styles.gridImage} />
        <Text style={styles.gridTitle} numberOfLines={2}>
          {item.title}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderCategoryPage = (category: string) => (
    <FlatList
      data={books}
      key={viewMode}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderBookItem}
      numColumns={viewMode === "grid" ? 3 : 1}
      showsVerticalScrollIndicator={false}
      columnWrapperStyle={
        viewMode === "grid" ? { justifyContent: "space-between" } : undefined
      }
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      contentContainerStyle={styles.listContainer}
    />
  );

  // underline động — dựa trên vị trí tab và scroll
  const underlineWidth = useMemo(() => {
    if (tabLayouts.length < categories.length) return 0;
    return scrollX.interpolate({
      inputRange: categories.map((_, i) => i * width),
      outputRange: tabLayouts.map((l) => l.width),
    });
  }, [tabLayouts]);

  const underlineTranslate = useMemo(() => {
    if (tabLayouts.length < categories.length) return 0;
    return scrollX.interpolate({
      inputRange: categories.map((_, i) => i * width),
      outputRange: tabLayouts.map((l) => l.x),
    });
  }, [tabLayouts]);

  useEffect(() => {
    if (tabLayouts.length === categories.length) {
      centerActiveTab(activeCategory);
    }
  }, [tabLayouts]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <TouchableOpacity activeOpacity={0.7}>
          <Ionicons name="arrow-back-outline" size={22} color="#222" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thể loại</Text>
        <TouchableOpacity onPress={toggleView} activeOpacity={0.7}>
          <Ionicons
            name={viewMode === "list" ? "grid-outline" : "list-outline"}
            size={22}
            color="black"
          />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <ScrollView
          ref={scrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ alignItems: "center" }}
        >
          {categories.map((category, index) => (
            <TouchableOpacity
              key={index}
              onLayout={(e) => onTabLayout(index, e)}
              onPress={() => handleCategoryPress(index)}
              activeOpacity={0.8}
              style={styles.tabItem}
            >
              <Text
                style={[
                  styles.tabText,
                  activeCategory === index && styles.tabTextActive,
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
          {tabLayouts.length === categories.length && (
            <Animated.View
              style={[
                styles.underline,
                {
                  width: underlineWidth,
                  transform: [{ translateX: underlineTranslate }],
                },
              ]}
            />
          )}
        </ScrollView>
      </View>

      {/* Pages */}
      <Animated.FlatList
        ref={flatListRef}
        data={categories}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onScrollEnd}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <View style={{ width }}>{renderCategoryPage(item)}</View>
        )}
      />
    </SafeAreaView>
  );
}
