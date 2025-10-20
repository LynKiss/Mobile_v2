import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../Api/config";

interface LeaderboardItem {
  ma_nguoi_dung: number;
  ten_nguoi_dung: string;
  borrow_count?: number;
  favorite_count?: number;
  total_penalty?: string;
  total_score?: string;
  rank: number;
}

const LeaderboardDetail = ({ route, navigation }: any) => {
  const { category, title, endpoint, colors } = route.params;
  const [leaderboard, setLeaderboard] = useState<LeaderboardItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const getToken = async () => {
    const token = await AsyncStorage.getItem("userToken");
    return token || "";
  };

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        headers: {
          Authorization: `Bearer ${await getToken()}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setLeaderboard(data);
      }
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const getValueText = (item: LeaderboardItem) => {
    switch (category) {
      case "borrow_count":
        return `Đã mượn: ${item.borrow_count || 0} lần`;
      case "favorites":
        return `Yêu thích: ${item.favorite_count || 0} sách`;
      case "overall":
        return `Điểm: ${item.total_score || 0} | Phạt: ${item.total_penalty || 0} VND`;
      default:
        return "";
    }
  };

  const renderItem = ({ item, index }: { item: LeaderboardItem; index: number }) => {
    return (
      <View style={styles.itemContainer}>
        <View
          style={[
            styles.rankBadge,
            {
              backgroundColor:
                index === 0
                  ? "#FFD700"
                  : index === 1
                  ? "#C0C0C0"
                  : index === 2
                  ? "#CD7F32"
                  : "#E5E7EB",
            },
          ]}
        >
          <Text
            style={[
              styles.rankText,
              { color: index < 3 ? "#000" : "#6B7280" },
            ]}
          >
            {index + 1}
          </Text>
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{item.ten_nguoi_dung}</Text>
          <Text style={styles.userValue}>{getValueText(item)}</Text>
        </View>
        {index < 3 && (
          <View style={styles.medalContainer}>
            <Ionicons
              name={
                index === 0
                  ? "medal"
                  : index === 1
                  ? "medal-outline"
                  : "ribbon-outline"
              }
              size={24}
              color={
                index === 0
                  ? "#FFD700"
                  : index === 1
                  ? "#C0C0C0"
                  : "#CD7F32"
              }
            />
          </View>
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors[0] }]}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.loadingText}>Đang tải bảng xếp hạng...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.header, { backgroundColor: colors[0] }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>{title}</Text>
          <Text style={styles.headerSubtitle}>
            Top người dùng xuất sắc
          </Text>
        </View>
      </View>

      <FlatList
        data={leaderboard}
        keyExtractor={(item) => item.ma_nguoi_dung.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
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
    paddingTop: 50,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 1,
  },
  headerContent: {
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
  },
  loadingContainer: {
    flex: 1,
  },

  loadingText: {
    color: "#fff",
    fontSize: 16,
    marginTop: 16,
  },
  listContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  rankBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  rankText: {
    fontWeight: "bold",
    fontSize: 16,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  userValue: {
    fontSize: 14,
    color: "#6B7280",
  },
  medalContainer: {
    marginLeft: 12,
  },
});

export default LeaderboardDetail;
