import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  TextInput,
  FlatList,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";

interface SupportItem {
  id: number;
  ma_nguoi_dung: number;
  tieu_de: string;
  noi_dung: string;
  trang_thai: string;
  ngay_tao: string;
  ten_nguoi_gui: string;
  replies?: {
    id: number;
    noi_dung: string;
    ngay_tao: string;
    nguoi_tra_loi: string;
  }[];
}

const ManHinhHoTro = ({ navigation }: any) => {
  const currentTheme = {
    colors: {
      background: "#FFFFFF",
      text: "#111827",
      textSecondary: "#6B7280",
      border: "#E5E7EB",
      surface: "#F9FAFB",
      primary: "#3B82F6",
    },
  };
  const theme = {
    spacing: {
      xs: 4,
      sm: 8,
      md: 16,
      lg: 24,
      xl: 32,
    },
    borderRadius: {
      sm: 8,
      md: 12,
      lg: 16,
    },
  };
  const [supportTitle, setSupportTitle] = useState("");
  const [supportContent, setSupportContent] = useState("");
  const [supportHistory, setSupportHistory] = useState<SupportItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [searchText, setSearchText] = useState("");

  const fetchSupportHistory = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) return;

      const response = await fetch("http://localhost:3000/api/ho_tro/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setSupportHistory(data);
      }
    } catch (error) {
      console.error("Error fetching support history:", error);
    }
  };

  useEffect(() => {
    fetchSupportHistory();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchSupportHistory();
    }, [])
  );

  const submitSupportRequest = async () => {
    if (!supportTitle.trim() || !supportContent.trim()) {
      Alert.alert("Lỗi", "Vui lòng điền đầy đủ tiêu đề và nội dung!");
      return;
    }

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("userToken");
      const response = await fetch("http://localhost:3000/api/ho_tro", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          tieu_de: supportTitle.trim(),
          noi_dung: supportContent.trim(),
        }),
      });

      if (response.ok) {
        Alert.alert("🎉 Thành công", "Yêu cầu hỗ trợ đã được gửi!");
        setSupportTitle("");
        setSupportContent("");
        setShowForm(false);
        fetchSupportHistory();
      } else {
        const errorData = await response.json();
        Alert.alert("Lỗi", errorData.message || "Gửi yêu cầu thất bại!");
      }
    } catch (error) {
      console.error("Error submitting support request:", error);
      Alert.alert("Lỗi", "Không thể kết nối đến máy chủ!");
    } finally {
      setLoading(false);
    }
  };

  const handleSupportItemPress = (item: SupportItem) => {
    navigation.navigate("SupportDetail", { supportItem: item });
  };

  const filteredSupportHistory = supportHistory.filter(
    (item) =>
      item.tieu_de.toLowerCase().includes(searchText.toLowerCase()) ||
      item.noi_dung.toLowerCase().includes(searchText.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Đã xử lý":
        return "#34C759";
      case "Đang xử lý":
        return "#FF9500";
      default:
        return "#007AFF";
    }
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: currentTheme.colors.background }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: 16,
          backgroundColor: "#FFFFFF",
          borderBottomWidth: 1,
          borderBottomColor: "#E5E7EB",
        }}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text
          style={{
            flex: 1,
            textAlign: "center",
            fontSize: 18,
            fontWeight: "600",
            color: "#111827",
          }}
        >
          Hỗ trợ & Yêu cầu
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate("ManHinhChatbox")}>
          <Ionicons name="chatbubble-ellipses" size={24} color="#111827" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={{ flex: 1, padding: theme.spacing.md }}
        showsVerticalScrollIndicator={false}
      >
        {/* Form gửi yêu cầu */}
        {showForm && (
          <View
            style={{
              marginBottom: theme.spacing.lg,
              backgroundColor: "#FFFFFF",
              borderRadius: 12,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
            }}
          >
            <View style={{ padding: theme.spacing.md }}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "600",
                  color: currentTheme.colors.text,
                  marginBottom: theme.spacing.md,
                }}
              >
                Gửi yêu cầu hỗ trợ
              </Text>

              <TextInput
                placeholder="Tiêu đề yêu cầu"
                placeholderTextColor={currentTheme.colors.textSecondary}
                style={{
                  borderWidth: 1,
                  borderColor: currentTheme.colors.border,
                  borderRadius: 12,
                  padding: 12,
                  marginBottom: theme.spacing.md,
                  color: currentTheme.colors.text,
                  fontSize: 16,
                }}
                value={supportTitle}
                onChangeText={setSupportTitle}
              />

              <TextInput
                placeholder="Mô tả chi tiết vấn đề bạn gặp phải..."
                placeholderTextColor={currentTheme.colors.textSecondary}
                style={{
                  borderWidth: 1,
                  borderColor: currentTheme.colors.border,
                  borderRadius: 12,
                  padding: 12,
                  color: currentTheme.colors.text,
                  fontSize: 16,
                  height: 120,
                  textAlignVertical: "top",
                  marginBottom: theme.spacing.md,
                }}
                multiline
                value={supportContent}
                onChangeText={setSupportContent}
              />

              <TouchableOpacity
                onPress={submitSupportRequest}
                disabled={loading}
                style={{
                  backgroundColor: currentTheme.colors.primary,
                  borderRadius: 12,
                  paddingVertical: 14,
                  alignItems: "center",
                  opacity: loading ? 0.6 : 1,
                }}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text
                    style={{ color: "#fff", fontWeight: "600", fontSize: 16 }}
                  >
                    Gửi yêu cầu
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Thanh tìm kiếm */}
        <View
          style={{
            flexDirection: "row",
            backgroundColor: currentTheme.colors.surface,
            borderRadius: 12,
            alignItems: "center",
            paddingHorizontal: 12,
            marginBottom: theme.spacing.md,
          }}
        >
          <Ionicons
            name="search-outline"
            size={20}
            color={currentTheme.colors.textSecondary}
          />
          <TextInput
            placeholder="Tìm kiếm yêu cầu..."
            placeholderTextColor={currentTheme.colors.textSecondary}
            style={{
              flex: 1,
              paddingVertical: 10,
              paddingHorizontal: 8,
              fontSize: 15,
              color: currentTheme.colors.text,
            }}
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>

        {/* Danh sách lịch sử hỗ trợ */}
        <Text
          style={{
            fontSize: 20,
            fontWeight: "600",
            color: currentTheme.colors.text,
            marginBottom: theme.spacing.md,
          }}
        >
          Lịch sử hỗ trợ
        </Text>

        {filteredSupportHistory.length > 0 ? (
          <FlatList
            data={filteredSupportHistory}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => handleSupportItemPress(item)}
              >
                <View
                  style={{
                    marginBottom: theme.spacing.sm,
                    backgroundColor: "#FFFFFF",
                    borderRadius: 12,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 3,
                  }}
                >
                  <View style={{ padding: theme.spacing.md }}>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 6,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: "600",
                          color: currentTheme.colors.text,
                          flex: 1,
                          marginRight: theme.spacing.sm,
                        }}
                        numberOfLines={1}
                      >
                        {item.tieu_de}
                      </Text>
                      <View
                        style={{
                          backgroundColor: getStatusColor(item.trang_thai),
                          borderRadius: 6,
                          paddingHorizontal: 8,
                          paddingVertical: 2,
                        }}
                      >
                        <Text
                          style={{
                            color: "#fff",
                            fontSize: 12,
                            fontWeight: "600",
                          }}
                        >
                          {item.trang_thai}
                        </Text>
                      </View>
                    </View>
                    <Text
                      style={{
                        fontSize: 14,
                        color: currentTheme.colors.textSecondary,
                        lineHeight: 20,
                        marginBottom: theme.spacing.xs,
                      }}
                      numberOfLines={2}
                    >
                      {item.noi_dung}
                    </Text>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 12,
                          color: currentTheme.colors.textSecondary,
                        }}
                      >
                        {new Date(item.ngay_tao).toLocaleDateString("vi-VN")}
                      </Text>
                      {item.replies && item.replies.length > 0 && (
                        <View
                          style={{ flexDirection: "row", alignItems: "center" }}
                        >
                          <Ionicons
                            name="chatbubble-ellipses"
                            size={14}
                            color={currentTheme.colors.primary}
                            style={{ marginRight: 4 }}
                          />
                          <Text
                            style={{
                              fontSize: 12,
                              color: currentTheme.colors.primary,
                              fontWeight: "500",
                            }}
                          >
                            {item.replies.length} phản hồi
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
        ) : (
          <View
            style={{
              padding: theme.spacing.xl,
              alignItems: "center",
              backgroundColor: currentTheme.colors.surface,
              borderRadius: theme.borderRadius.md,
            }}
          >
            <Ionicons
              name="document-text-outline"
              size={48}
              color={currentTheme.colors.textSecondary}
              style={{ marginBottom: theme.spacing.md }}
            />
            <Text style={{ color: currentTheme.colors.textSecondary }}>
              Chưa có yêu cầu hỗ trợ nào
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ManHinhHoTro;
