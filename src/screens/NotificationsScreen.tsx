import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../Api/config";

interface Notification {
  ma_tb: number;
  noi_dung: string;
  ngay_gui: string;
  da_doc: boolean;
  loai_tb: string;
  meta?: any;
}

const NotificationsScreen = ({ navigation }: any) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const userString = await AsyncStorage.getItem("user");
      if (!token || !userString) return;

      const user = JSON.parse(userString);
      const userId = user.ma_nguoi_dung;

      const response = await fetch(
        `${API_URL}/api/notifications?ma_nguoi_dung=${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.ok) {
        const data = await response.json();
        // Sort notifications: unread first (newest first), then read (newest first)
        const sortedData = data.sort((a: Notification, b: Notification) => {
          if (a.da_doc && !b.da_doc) return 1; // b (unread) before a (read)
          if (!a.da_doc && b.da_doc) return -1; // a (unread) before b (read)
          // Both same read status, sort by date descending (newest first)
          return new Date(b.ngay_gui).getTime() - new Date(a.ngay_gui).getTime();
        });
        setNotifications(sortedData);
      } else {
        console.error("Failed to fetch notifications");
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const markAsRead = async (ma_tb: number) => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) return;

      const response = await fetch(
        `${API_URL}/api/notifications/${ma_tb}/read`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.ok) {
        setNotifications((prev) =>
          prev.map((notif) =>
            notif.ma_tb === ma_tb ? { ...notif, da_doc: true } : notif
          )
        );
      } else {
        Alert.alert("Lỗi", "Không thể đánh dấu đã đọc");
      }
    } catch (error) {
      console.error("Error marking as read:", error);
      Alert.alert("Lỗi", "Có lỗi xảy ra khi đánh dấu đã đọc");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderNotification = ({ item }: { item: Notification }) => (
    <TouchableOpacity
      style={[
        styles.notificationItem,
        !item.da_doc && styles.unreadNotification,
      ]}
      onPress={() => !item.da_doc && markAsRead(item.ma_tb)}
      activeOpacity={0.7}
    >
      <View style={styles.notificationContent}>
        <View style={styles.notificationHeader}>
          <Text style={styles.notificationType}>
            {item.loai_tb === "book_due" && "📚 Hạn trả sách"}
            {item.loai_tb === "new_book" && "🆕 Sách mới"}
            {item.loai_tb === "system" && "⚙️ Hệ thống"}
            {item.loai_tb === "promotion" && "🎉 Khuyến mãi"}
            {!["book_due", "new_book", "system", "promotion"].includes(
              item.loai_tb
            ) && "📢 Thông báo"}
          </Text>
          {!item.da_doc && <View style={styles.unreadDot} />}
        </View>
        <Text style={styles.notificationText}>{item.noi_dung}</Text>
        <Text style={styles.notificationDate}>{formatDate(item.ngay_gui)}</Text>
      </View>
      {!item.da_doc && (
        <TouchableOpacity
          style={styles.markReadButton}
          onPress={() => markAsRead(item.ma_tb)}
        >
          <Ionicons name="checkmark-circle" size={24} color="#2AA3A3" />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchNotifications();
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#2AA3A3" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Thông báo</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.loadingContainer}>
          <Ionicons name="notifications-outline" size={48} color="#ccc" />
          <Text style={styles.loadingText}>Đang tải thông báo...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#2AA3A3" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thông báo</Text>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.ma_tb.toString()}
        renderItem={renderNotification}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="notifications-off-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>Không có thông báo nào</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1D1D1F",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "#666",
    marginTop: 16,
  },
  listContainer: {
    padding: 16,
  },
  notificationItem: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  unreadNotification: {
    backgroundColor: "#F0F8FF",
    borderLeftWidth: 4,
    borderLeftColor: "#2AA3A3",
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  notificationType: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2AA3A3",
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#2AA3A3",
  },
  notificationText: {
    fontSize: 16,
    color: "#1D1D1F",
    lineHeight: 22,
    marginBottom: 8,
  },
  notificationDate: {
    fontSize: 12,
    color: "#6B6B6B",
  },
  markReadButton: {
    padding: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    marginTop: 16,
  },
});

export default NotificationsScreen;
