import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../Api/config";

interface LeaderboardItem {
  ma_nguoi_dung: number;
  ho_ten: string;
  tong_no: number;
}

const LeaderboardTab = () => {
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
      const response = await fetch(`${API_URL}/quan-ly/sach-muon-nhieu-nhat`, {
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

  const renderItem = ({ item, index }: { item: LeaderboardItem; index: number }) => (
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
        <Text style={styles.userName}>{item.ho_ten}</Text>
        <Text style={styles.userDebt}>
          Tổng nợ: {item.tong_no.toLocaleString()} VND
        </Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2AA3A3" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bảng Xếp Hạng Người Mượn Sách Nhiều Nhất</Text>
      <FlatList
        data={leaderboard}
        keyExtractor={(item) => item.ma_nguoi_dung.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 24,
    color: "#1D1D1F",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContainer: {
    paddingBottom: 20,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  rankBadge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  rankText: {
    fontWeight: "bold",
    fontSize: 14,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  userDebt: {
    fontSize: 14,
    color: "#6B7280",
  },
});

export default LeaderboardTab;
