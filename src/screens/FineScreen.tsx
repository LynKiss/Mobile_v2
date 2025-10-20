import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
  Linking,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../contexts/AuthContext";
import { API_URL } from "../Api/config";
import { useNavigation } from "@react-navigation/native";

const Tab = createMaterialTopTabNavigator();

interface Fine {
  ma_phat: number;
  so_tien: number;
  so_duoc_thanh_toan: number;
  con_no: number;
  ly_do: string;
  ngay_phat: string;
  trang_thai: string;
}

interface LeaderboardItem {
  ma_nguoi_dung: number;
  ho_ten: string;
  tong_no: number;
}

function LeaderboardTab() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchLeaderboard();
  }, []);

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

  const getToken = async () => {
    const token = await AsyncStorage.getItem("userToken");
    return token || "";
  };

  const renderLeaderboardItem = ({
    item,
    index,
  }: {
    item: LeaderboardItem;
    index: number;
  }) => (
    <View
      style={{
        flexDirection: "row",
        padding: 16,
        backgroundColor: "#fff",
        marginHorizontal: 16,
        marginVertical: 4,
        borderRadius: 8,
        elevation: 2,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
      }}
    >
      <View
        style={{
          width: 30,
          height: 30,
          borderRadius: 15,
          backgroundColor:
            index === 0
              ? "#FFD700"
              : index === 1
              ? "#C0C0C0"
              : index === 2
              ? "#CD7F32"
              : "#E5E7EB",
          justifyContent: "center",
          alignItems: "center",
          marginRight: 12,
        }}
      >
        <Text
          style={{ fontWeight: "bold", color: index < 3 ? "#000" : "#6B7280" }}
        >
          {index + 1}
        </Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 16, fontWeight: "600", color: "#111827" }}>
          {item.ho_ten}
        </Text>
        <Text style={{ fontSize: 14, color: "#6B7280" }}>
          Tổng nợ: {item.tong_no.toLocaleString()} VND
        </Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#2AA3A3" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
      <FlatList
        data={leaderboard}
        renderItem={renderLeaderboardItem}
        keyExtractor={(item) => item.ma_nguoi_dung.toString()}
        ListHeaderComponent={
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              textAlign: "center",
              padding: 16,
              color: "#111827",
            }}
          >
            Bảng Xếp Hạng Người Mượn Sách Nhiều Nhất
          </Text>
        }
      />
    </View>
  );
}

function FineListTab({ navigation }: any) {
  const [fines, setFines] = useState<Fine[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchFines();
  }, []);

  const fetchFines = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/phat/user/${user?.ma_nguoi_dung}`,
        {
          headers: {
            Authorization: `Bearer ${await getToken()}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setFines(data);
      }
    } catch (error) {
      console.error("Error fetching fines:", error);
    } finally {
      setLoading(false);
    }
  };

  const getToken = async () => {
    const token = await AsyncStorage.getItem("userToken");
    return token || "";
  };

  const handlePayment = async (fine: Fine) => {
    try {
      const response = await fetch(`${API_URL}/api/payment/momo/pay`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await getToken()}`,
        },
        body: JSON.stringify({
          ma_nguoi_dung: user?.ma_nguoi_dung,
          so_tien: fine.con_no,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Payment response:", data);
        if (data.payUrl) {
          // For mobile apps, try to open in external browser
          Linking.canOpenURL(data.payUrl).then((supported) => {
            if (supported) {
              Linking.openURL(data.payUrl);
            } else {
              Alert.alert("Lỗi", "Không thể mở URL thanh toán");
            }
          });
        } else {
          Alert.alert("Lỗi", "Không nhận được URL thanh toán");
        }
      } else {
        const errorData = await response.json();
        console.error("Payment error response:", errorData);
        Alert.alert("Lỗi", errorData.error || "Không thể tạo thanh toán");
      }
    } catch (error) {
      console.error("Payment error:", error);
      Alert.alert("Lỗi", "Có lỗi xảy ra khi thanh toán");
    }
  };

  const renderFineItem = ({ item }: { item: Fine }) => (
    <View
      style={{
        backgroundColor: "#fff",
        marginHorizontal: 16,
        marginVertical: 8,
        borderRadius: 12,
        padding: 16,
        elevation: 3,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "600",
              color: "#111827",
              marginBottom: 4,
            }}
          >
            Phạt #{item.ma_phat}
          </Text>
          <Text style={{ fontSize: 14, color: "#6B7280", marginBottom: 2 }}>
            Lý do: {item.ly_do}
          </Text>
          <Text style={{ fontSize: 14, color: "#6B7280", marginBottom: 2 }}>
            Ngày phạt: {new Date(item.ngay_phat).toLocaleDateString("vi-VN")}
          </Text>
          <Text style={{ fontSize: 14, color: "#6B7280", marginBottom: 8 }}>
            Trạng thái: {item.trang_thai}
          </Text>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={{ fontSize: 14, color: "#EF4444", fontWeight: "600" }}>
              Còn nợ: {item.con_no.toLocaleString()} VND
            </Text>
            <Text style={{ fontSize: 14, color: "#22C55E", fontWeight: "600" }}>
              Đã trả: {item.so_duoc_thanh_toan.toLocaleString()} VND
            </Text>
          </View>
        </View>
      </View>

      {item.con_no > 0 && (
        <TouchableOpacity
          style={{
            backgroundColor: "#2AA3A3",
            paddingVertical: 12,
            paddingHorizontal: 24,
            borderRadius: 8,
            marginTop: 12,
            alignItems: "center",
          }}
          onPress={() => handlePayment(item)}
        >
          <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>
            Thanh toán {item.con_no.toLocaleString()} VND
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#2AA3A3" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
      <FlatList
        data={fines}
        renderItem={renderFineItem}
        keyExtractor={(item) => item.ma_phat.toString()}
        ListHeaderComponent={
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              textAlign: "center",
              padding: 16,
              color: "#111827",
            }}
          >
            Danh Sách Phạt
          </Text>
        }
        ListEmptyComponent={
          <View style={{ alignItems: "center", padding: 32 }}>
            <Ionicons
              name="checkmark-circle-outline"
              size={64}
              color="#22C55E"
            />
            <Text
              style={{
                fontSize: 16,
                color: "#6B7280",
                marginTop: 16,
                textAlign: "center",
              }}
            >
              Bạn không có khoản phạt nào!
            </Text>
          </View>
        }
      />
    </View>
  );
}

export default function FineScreen({ navigation }: any) {
  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          paddingTop: 60,
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 16,
          paddingVertical: 12,
          backgroundColor: "#fff",
          elevation: 2,
          shadowColor: "#000",
          shadowOpacity: 0.1,
          shadowRadius: 4,
          shadowOffset: { width: 0, height: 2 },
        }}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            padding: 8,
            marginRight: 12,
          }}
        >
          <Ionicons name="arrow-back" size={24} color="#2AA3A3" />
        </TouchableOpacity>
        <Text
          style={{
            fontSize: 18,
            fontWeight: "600",
            color: "#111827",
          }}
        >
          Phạt & Thanh toán
        </Text>
      </View>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: "#2AA3A3",
          tabBarInactiveTintColor: "#6B7280",
          tabBarIndicatorStyle: { backgroundColor: "#2AA3A3" },
          tabBarLabelStyle: { fontSize: 14, fontWeight: "600" },
          tabBarStyle: { backgroundColor: "#fff" },
        }}
      >
        <Tab.Screen
          name="Bảng Xếp Hạng"
          component={LeaderboardTab}
          options={{
            tabBarIcon: ({ color }) => (
              <Ionicons name="trophy-outline" size={20} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Danh Sách Phạt"
          component={FineListTab}
          options={{
            tabBarIcon: ({ color }) => (
              <Ionicons name="document-text-outline" size={20} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    </View>
  );
}
