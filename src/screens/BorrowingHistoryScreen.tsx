import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "../styles/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../styles/theme";
import Card from "../fontA/Card";
import Header from "../fontA/Header";
import { API_URL } from "../Api/config";

interface BorrowingSlip {
  ma_phieu_muon: number;
  ngay_muon: string;
  han_tra: string;
  trang_thai_phieu: string;
}

const BorrowingHistoryScreen = ({ navigation }: any) => {
  const { theme: currentTheme } = useTheme();
  const [borrowingHistory, setBorrowingHistory] = useState<BorrowingSlip[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"borrowed" | "returned">(
    "borrowed"
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(10);

  useEffect(() => {
    fetchBorrowingHistory();
  }, [activeTab, currentPage]);

  const fetchBorrowingHistory = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      // Fetch all data first, then filter and paginate client-side
      const response = await fetch(`${API_URL}/api/phieu_muon/lich-su`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        let allData = data.data || data;

        // Filter data based on active tab
        let filteredData = allData;
        if (activeTab === "borrowed") {
          filteredData = allData.filter(
            (item: BorrowingSlip) =>
              item.trang_thai_phieu.toLowerCase().includes("dang_muon") ||
              item.trang_thai_phieu.toLowerCase().includes("đang mượn")
          );
        } else if (activeTab === "returned") {
          filteredData = allData.filter(
            (item: BorrowingSlip) =>
              item.trang_thai_phieu.toLowerCase().includes("da_tra") ||
              item.trang_thai_phieu.toLowerCase().includes("đã trả")
          );
        }

        // Calculate pagination
        const totalItems = filteredData.length;
        const calculatedTotalPages = Math.ceil(totalItems / pageSize);
        setTotalPages(calculatedTotalPages);

        // Get current page data
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const pageData = filteredData.slice(startIndex, endIndex);

        setBorrowingHistory(pageData);
      } else {
        Alert.alert("Lỗi", "Không thể tải lịch sử mượn sách");
      }
    } catch (error) {
      Alert.alert("Lỗi", "Có lỗi xảy ra khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab: "borrowed" | "returned") => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "đang mượn":
        return "#007AFF";
      case "đã trả":
        return "#34C759";
      case "quá hạn":
        return "#FF3B30";
      default:
        return "#8E8E93";
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case "dang_muon":
        return "Đang mượn";
      case "da_tra":
        return "Đã trả";
      case "qua_han":
        return "Quá hạn";
      default:
        return status;
    }
  };

  const renderBorrowingItem = ({ item }: { item: BorrowingSlip }) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("BorrowingDetail", { slipId: item.ma_phieu_muon })
      }
      style={{ marginBottom: theme.spacing.md }}
    >
      <Card>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: currentTheme.colors.text,
                marginBottom: theme.spacing.xs,
              }}
            >
              Phiếu mượn #{item.ma_phieu_muon}
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: currentTheme.colors.textSecondary,
                marginBottom: theme.spacing.xs,
              }}
            >
              📅 Ngày mượn:{" "}
              {new Date(item.ngay_muon).toLocaleDateString("vi-VN")}
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: currentTheme.colors.textSecondary,
                marginBottom: theme.spacing.sm,
              }}
            >
              📅 Trả dự kiến:{" "}
              {new Date(item.han_tra).toLocaleDateString("vi-VN")}
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-end",
              }}
            >
              <View
                style={{
                  backgroundColor: getStatusColor(item.trang_thai_phieu),
                  paddingHorizontal: theme.spacing.sm,
                  paddingVertical: theme.spacing.xs,
                  borderRadius: theme.borderRadius.sm,
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: "600",
                    color: "#ffffff",
                  }}
                >
                  {getStatusText(item.trang_thai_phieu)}
                </Text>
              </View>
            </View>
          </View>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={currentTheme.colors.textSecondary}
          />
        </View>
      </Card>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: currentTheme.colors.background,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color={currentTheme.colors.primary} />
        <Text
          style={{
            marginTop: theme.spacing.md,
            fontSize: 16,
            color: currentTheme.colors.textSecondary,
          }}
        >
          Đang tải lịch sử...
        </Text>
      </SafeAreaView>
    );
  }

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages: JSX.Element[] = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <TouchableOpacity
          key={i}
          onPress={() => handlePageChange(i)}
          style={{
            paddingHorizontal: theme.spacing.sm,
            paddingVertical: theme.spacing.xs,
            marginHorizontal: 2,
            backgroundColor:
              currentPage === i
                ? currentTheme.colors.primary
                : currentTheme.colors.surface,
            borderRadius: theme.borderRadius.sm,
          }}
        >
          <Text
            style={{
              color: currentPage === i ? "#fff" : currentTheme.colors.text,
              fontSize: 14,
              fontWeight: "600",
            }}
          >
            {i}
          </Text>
        </TouchableOpacity>
      );
    }

    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          paddingVertical: theme.spacing.md,
        }}
      >
        <TouchableOpacity
          onPress={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          style={{
            paddingHorizontal: theme.spacing.sm,
            paddingVertical: theme.spacing.xs,
            marginRight: theme.spacing.sm,
            opacity: currentPage === 1 ? 0.5 : 1,
          }}
        >
          <Ionicons
            name="chevron-back"
            size={20}
            color={currentTheme.colors.text}
          />
        </TouchableOpacity>
        {pages}
        <TouchableOpacity
          onPress={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          style={{
            paddingHorizontal: theme.spacing.sm,
            paddingVertical: theme.spacing.xs,
            marginLeft: theme.spacing.sm,
            opacity: currentPage === totalPages ? 0.5 : 1,
          }}
        >
          <Ionicons
            name="chevron-forward"
            size={20}
            color={currentTheme.colors.text}
          />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: currentTheme.colors.background,
      }}
    >
      <Header
        title="Lịch sử mượn sách"
        leftIcon="arrow-back"
        onLeftPress={() => navigation.goBack()}
      />

      {/* Tabs */}
      <View
        style={{
          flexDirection: "row",
          paddingHorizontal: theme.spacing.md,
          paddingVertical: theme.spacing.sm,
          backgroundColor: currentTheme.colors.surface,
        }}
      >
        <TouchableOpacity
          onPress={() => handleTabChange("borrowed")}
          style={{
            flex: 1,
            paddingVertical: theme.spacing.sm,
            alignItems: "center",
            backgroundColor:
              activeTab === "borrowed"
                ? currentTheme.colors.primary
                : "transparent",
            borderRadius: theme.borderRadius.sm,
            marginRight: theme.spacing.xs,
          }}
        >
          <Text
            style={{
              color:
                activeTab === "borrowed" ? "#fff" : currentTheme.colors.text,
              fontSize: 16,
              fontWeight: "600",
            }}
          >
            Đang mượn
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleTabChange("returned")}
          style={{
            flex: 1,
            paddingVertical: theme.spacing.sm,
            alignItems: "center",
            backgroundColor:
              activeTab === "returned"
                ? currentTheme.colors.primary
                : "transparent",
            borderRadius: theme.borderRadius.sm,
            marginLeft: theme.spacing.xs,
          }}
        >
          <Text
            style={{
              color:
                activeTab === "returned" ? "#fff" : currentTheme.colors.text,
              fontSize: 16,
              fontWeight: "600",
            }}
          >
            Đã trả
          </Text>
        </TouchableOpacity>
      </View>

      <View style={{ flex: 1 }}>
        {borrowingHistory.length === 0 ? (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              padding: theme.spacing.md,
            }}
          >
            <Ionicons
              name="book-outline"
              size={64}
              color={currentTheme.colors.textSecondary}
            />
            <Text
              style={{
                fontSize: 18,
                fontWeight: "600",
                color: currentTheme.colors.text,
                marginTop: theme.spacing.md,
                marginBottom: theme.spacing.sm,
                textAlign: "center",
              }}
            >
              {activeTab === "borrowed"
                ? "Chưa có sách đang mượn"
                : "Chưa có lịch sử trả sách"}
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: currentTheme.colors.textSecondary,
                textAlign: "center",
              }}
            >
              {activeTab === "borrowed"
                ? "Khi bạn mượn sách, sẽ xuất hiện ở đây"
                : "Khi bạn trả sách, lịch sử sẽ xuất hiện ở đây"}
            </Text>
          </View>
        ) : (
          <FlatList
            data={borrowingHistory}
            keyExtractor={(item, index) => `${item.ma_phieu_muon}-${index}`}
            renderItem={renderBorrowingItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              padding: theme.spacing.md,
              paddingBottom: theme.spacing.xl,
            }}
          />
        )}
        {renderPagination()}
      </View>
    </SafeAreaView>
  );
};

export default BorrowingHistoryScreen;
