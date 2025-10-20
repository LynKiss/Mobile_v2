import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

// Fake news data
const fakeNews = [
  {
    id: 1,
    title: "Thư viện Quốc gia Việt Nam đón nhận bộ sưu tập sách quý hiếm",
    content:
      "Thư viện Quốc gia vừa nhận được bộ sưu tập sách cổ từ thế kỷ 18, bao gồm các tác phẩm văn học kinh điển và tài liệu lịch sử quý báu.",
    image: "https://picsum.photos/400/250?random=1",
    date: "2024-01-15",
    category: "Sự kiện",
  },
  {
    id: 2,
    title: "Chương trình đọc sách hè dành cho thiếu nhi",
    content:
      "Thư viện tổ chức chương trình đọc sách hè với hàng trăm đầu sách hấp dẫn, hoạt động vui chơi và tặng quà cho các em nhỏ.",
    image: "https://picsum.photos/400/250?random=2",
    date: "2024-01-10",
    category: "Hoạt động",
  },
  {
    id: 3,
    title: "Ra mắt ứng dụng thư viện điện tử mới",
    content:
      "Ứng dụng mới cho phép người dùng mượn sách online, theo dõi lịch sử mượn và nhận thông báo về sách mới một cách thuận tiện.",
    image: "https://picsum.photos/400/250?random=3",
    date: "2024-01-08",
    category: "Công nghệ",
  },
  {
    id: 4,
    title: "Hội thảo về bảo tồn sách cổ",
    content:
      "Các chuyên gia từ trong và ngoài nước tham gia hội thảo về phương pháp bảo quản và phục hồi sách cổ quý hiếm.",
    image: "https://picsum.photos/400/250?random=4",
    date: "2024-01-05",
    category: "Hội thảo",
  },
  {
    id: 5,
    title: "Thư viện mở rộng giờ hoạt động",
    content:
      "Từ tháng này, thư viện sẽ mở cửa đến 22h hàng ngày để phục vụ nhu cầu đọc sách của người dân tốt hơn.",
    image: "https://picsum.photos/400/250?random=5",
    date: "2024-01-03",
    category: "Thông báo",
  },
  {
    id: 6,
    title: "Cuộc thi viết sách thiếu nhi toàn quốc",
    content:
      "Thư viện phối hợp tổ chức cuộc thi viết sách thiếu nhi, khuyến khích các em nhỏ sáng tạo và yêu thích văn học.",
    image: "https://picsum.photos/400/250?random=6",
    date: "2024-01-01",
    category: "Cuộc thi",
  },
];

const { width } = Dimensions.get("window");

const NewsScreen: React.FC = () => {
  const navigation = useNavigation();

  const renderNewsItem = (item: (typeof fakeNews)[0]) => (
    <TouchableOpacity key={item.id} style={styles.newsCard} activeOpacity={0.9}>
      <View style={styles.newsImageContainer}>
        <Image
          source={{ uri: item.image }}
          style={styles.newsImage}
          resizeMode="cover"
        />
      </View>
      <View style={styles.newsContent}>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{item.category}</Text>
        </View>
        <Text style={styles.newsTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.newsExcerpt} numberOfLines={3}>
          {item.content}
        </Text>
        <Text style={styles.newsDate}>{item.date}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
          accessibilityLabel="Quay lại"
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tin tức & Sự kiện</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>Cập nhật tin tức mới nhất</Text>
          <Text style={styles.welcomeSubtitle}>
            Theo dõi các hoạt động, sự kiện và thông tin thú vị từ thư viện
          </Text>
        </View>

        {fakeNews.map(renderNewsItem)}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#2AA3A3",
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingTop: 50, // For status bar
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
    textAlign: "center",
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  welcomeSection: {
    paddingVertical: 24,
    alignItems: "center",
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#0F172A",
    textAlign: "center",
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 24,
  },
  newsCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 4,
    overflow: "hidden",
  },
  newsImageContainer: {
    height: 200,
    backgroundColor: "#E6E9EE",
  },
  newsImage: {
    flex: 1,
  },
  newsContent: {
    padding: 16,
  },
  categoryBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#2AA3A3",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  categoryText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  newsTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 8,
    lineHeight: 24,
  },
  newsExcerpt: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
    marginBottom: 12,
  },
  newsDate: {
    fontSize: 12,
    color: "#9CA3AF",
    fontWeight: "500",
  },
});

export default NewsScreen;
