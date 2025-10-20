import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";


const { width } = Dimensions.get("window");

interface Category {
  id: string;
  title: string;
  description: string;
  icon: string;
  colors: [string, string];
  endpoint: string;
}

const categories: Category[] = [
  {
    id: "borrow_count",
    title: "Mượn Nhiều Nhất",
    description: "Người dùng mượn sách nhiều nhất",
    icon: "book-outline",
    colors: ["#FFD700", "#FFA500"],
    endpoint: "/quan-ly/ranking/borrow-count",
  },
  {
    id: "favorites",
    title: "Yêu Thích Nhiều",
    description: "Người dùng yêu thích sách nhiều nhất",
    icon: "heart-outline",
    colors: ["#FF6B6B", "#EE5A24"],
    endpoint: "/quan-ly/ranking/favorites",
  },
  {
    id: "overall",
    title: "Xếp Hạng Tổng",
    description: "Xếp hạng tổng thể người dùng",
    icon: "trophy-outline",
    colors: ["#4ECDC4", "#44A08D"],
    endpoint: "/quan-ly/ranking/overall",
  },
];

const LeaderboardSelection = ({ navigation }: any) => {
  const handleCategoryPress = (category: Category) => {
    navigation.navigate("LeaderboardDetail", {
      category: category.id,
      title: category.title,
      endpoint: category.endpoint,
      colors: category.colors,
    });
  };

  const renderCategory = (category: Category) => (
    <TouchableOpacity
      key={category.id}
      style={[styles.categoryCard, { backgroundColor: category.colors[0] }]}
      onPress={() => handleCategoryPress(category)}
      activeOpacity={0.8}
    >
      <View style={styles.categoryContent}>
        <View style={styles.iconContainer}>
          <Ionicons name={category.icon as any} size={32} color="#fff" />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.categoryTitle}>{category.title}</Text>
          <Text style={styles.categoryDescription}>
            {category.description}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={24} color="#fff" />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Bảng Xếp Hạng</Text>
        <Text style={styles.headerSubtitle}>
          Chọn danh mục để xem xếp hạng
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {categories.map(renderCategory)}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1D1D1F",
    textAlign: "center",
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#6B6B6B",
    textAlign: "center",
  },
  scrollContainer: {
    padding: 20,
  },
  categoryCard: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    padding: 20,
  },
  categoryContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  categoryDescription: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
    lineHeight: 20,
  },
});

export default LeaderboardSelection;
