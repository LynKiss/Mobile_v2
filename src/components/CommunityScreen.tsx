import React from "react";
import { View, Text, StyleSheet, Image, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const posts = [
  {
    id: "1",
    user: "Nguyễn Văn A",
    avatar: "https://i.pravatar.cc/100?img=1",
    content: "Mình vừa đọc xong *Atomic Habits* — thật sự đáng học mỗi ngày!",
    likes: 120,
    comments: 8,
  },
  {
    id: "2",
    user: "Trần Thị B",
    avatar: "https://i.pravatar.cc/100?img=2",
    content:
      "Có ai gợi ý thêm sách về kỹ năng giao tiếp như *How to Win Friends* không?",
    likes: 45,
    comments: 3,
  },
];

const CommunityScreen = () => {
  const renderItem = ({ item }: any) => (
    <View style={styles.card}>
      <View style={styles.row}>
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
        <Text style={styles.username}>{item.user}</Text>
      </View>
      <Text style={styles.content}>{item.content}</Text>
      <View style={styles.actions}>
        <View style={styles.action}>
          <Ionicons name="heart-outline" size={18} color="#FF3B30" />
          <Text style={styles.actionText}>{item.likes}</Text>
        </View>
        <View style={styles.action}>
          <Ionicons name="chatbubble-outline" size={18} color="#007AFF" />
          <Text style={styles.actionText}>{item.comments}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      contentContainerStyle={{ padding: 16 }}
    />
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  row: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  avatar: { width: 36, height: 36, borderRadius: 18, marginRight: 8 },
  username: { fontWeight: "600", fontSize: 15, color: "#1D1D1F" },
  content: { fontSize: 14, color: "#333", marginBottom: 8 },
  actions: { flexDirection: "row" },
  action: { flexDirection: "row", alignItems: "center", marginRight: 16 },
  actionText: { marginLeft: 4, color: "#6B6B6B" },
});

export default CommunityScreen;
