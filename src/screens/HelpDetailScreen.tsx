import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

import { useFocusEffect } from "@react-navigation/native";

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

const Header = ({ title, leftIcon, onLeftPress }: any) => (
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
    <TouchableOpacity onPress={onLeftPress}>
      <Ionicons name={leftIcon} size={24} color="#111827" />
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
      {title}
    </Text>
    <View style={{ width: 24 }} />
  </View>
);

const Card = ({ children, style }: any) => (
  <View
    style={[
      {
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      },
      style,
    ]}
  >
    {children}
  </View>
);

const ManHinhChiTietHoTro = ({ navigation, route }: any) => {
  const { supportItem } = route.params;

  const [replyText, setReplyText] = useState("");
  const [loading, setLoading] = useState(false);
  const [replies, setReplies] = useState(supportItem.replies || []);

  const addReply = (newReply: any) => {
    setReplies((prev: any) => [...prev, newReply]);
  };

  const refreshSupportItem = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) return;

      const response = await fetch(
        `http://localhost:3000/api/ho_tro/${supportItem.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.ok) {
        const updated = await response.json();
        setReplies(updated.replies || []);
      }
    } catch (err) {
      console.error("Error refreshing:", err);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      refreshSupportItem();
    }, [])
  );

  const formatDate = (date: string) =>
    new Date(date).toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

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
      <Header
        title="Chi tiết hỗ trợ"
        leftIcon="arrow-back"
        onLeftPress={() => navigation.goBack()}
      />

      <ScrollView
        style={{ flex: 1, padding: theme.spacing.md }}
        showsVerticalScrollIndicator={false}
      >
        {/* Thông tin yêu cầu */}
        <Card style={{ marginBottom: theme.spacing.lg }}>
          <View style={{ padding: theme.spacing.md }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: theme.spacing.sm,
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "600",
                  color: currentTheme.colors.text,
                  flex: 1,
                  marginRight: theme.spacing.sm,
                }}
              >
                {supportItem.tieu_de}
              </Text>

              <View
                style={{
                  backgroundColor: getStatusColor(supportItem.trang_thai),
                  borderRadius: 6,
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                }}
              >
                <Text
                  style={{ color: "#fff", fontWeight: "600", fontSize: 12 }}
                >
                  {supportItem.trang_thai}
                </Text>
              </View>
            </View>

            <Text
              style={{
                fontSize: 15,
                color: currentTheme.colors.textSecondary,
                lineHeight: 22,
                marginBottom: theme.spacing.md,
              }}
            >
              {supportItem.noi_dung}
            </Text>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                borderTopWidth: 1,
                borderTopColor: currentTheme.colors.border,
                paddingTop: theme.spacing.sm,
              }}
            >
              <Text
                style={{
                  color: currentTheme.colors.textSecondary,
                  fontSize: 13,
                }}
              >
                Người gửi: {supportItem.ten_nguoi_gui}
              </Text>
              <Text
                style={{
                  color: currentTheme.colors.textSecondary,
                  fontSize: 13,
                }}
              >
                {formatDate(supportItem.ngay_tao)}
              </Text>
            </View>
          </View>
        </Card>

        {/* Danh sách phản hồi */}
        <View style={{ marginBottom: theme.spacing.lg }}>
          {replies.length > 0 ? (
            replies.map((reply: any, i: number) => (
              <View
                key={i}
                style={{
                  alignSelf:
                    reply.nguoi_tra_loi?.toLowerCase()?.includes("bạn") ||
                    reply.nguoi_tra_loi === supportItem.ten_nguoi_gui
                      ? "flex-end"
                      : "flex-start",
                  marginBottom: theme.spacing.sm,
                  maxWidth: "85%",
                }}
              >
                <View
                  style={{
                    backgroundColor:
                      reply.nguoi_tra_loi === supportItem.ten_nguoi_gui
                        ? "#E5E5EA"
                        : "#007AFF",
                    padding: theme.spacing.md,
                    borderRadius: 16,
                    borderBottomLeftRadius:
                      reply.nguoi_tra_loi === supportItem.ten_nguoi_gui
                        ? 16
                        : 4,
                    borderBottomRightRadius:
                      reply.nguoi_tra_loi === supportItem.ten_nguoi_gui
                        ? 4
                        : 16,
                  }}
                >
                  <Text
                    style={{
                      color:
                        reply.nguoi_tra_loi === supportItem.ten_nguoi_gui
                          ? "#000"
                          : "#fff",
                      fontSize: 15,
                      lineHeight: 20,
                    }}
                  >
                    {reply.noi_dung}
                  </Text>
                </View>
                <Text
                  style={{
                    marginTop: 4,
                    fontSize: 11,
                    color: currentTheme.colors.textSecondary,
                    textAlign:
                      reply.nguoi_tra_loi === supportItem.ten_nguoi_gui
                        ? "right"
                        : "left",
                  }}
                >
                  {formatDate(reply.ngay_tao)}
                </Text>
              </View>
            ))
          ) : (
            <View
              style={{
                padding: theme.spacing.xl,
                backgroundColor: currentTheme.colors.surface,
                borderRadius: theme.borderRadius.md,
                alignItems: "center",
              }}
            >
              <Ionicons
                name="chatbubble-outline"
                size={40}
                color={currentTheme.colors.textSecondary}
                style={{ marginBottom: theme.spacing.sm }}
              />
              <Text style={{ color: currentTheme.colors.textSecondary }}>
                Chưa có phản hồi nào
              </Text>
            </View>
          )}
        </View>

        {/* Ô nhập phản hồi */}
        <Card>
          <View style={{ padding: theme.spacing.md }}>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: currentTheme.colors.border,
                borderRadius: 12,
                padding: theme.spacing.md,
                fontSize: 15,
                backgroundColor: currentTheme.colors.surface,
                color: currentTheme.colors.text,
                height: 90,
                textAlignVertical: "top",
              }}
              placeholder="Nhập phản hồi của bạn..."
              placeholderTextColor={currentTheme.colors.textSecondary}
              multiline
              value={replyText}
              onChangeText={setReplyText}
            />
            <TouchableOpacity
              style={{
                marginTop: theme.spacing.md,
                backgroundColor: replyText.trim()
                  ? currentTheme.colors.primary
                  : "#C7C7CC",
                borderRadius: 12,
                paddingVertical: 12,
                alignItems: "center",
              }}
              disabled={!replyText.trim() || loading}
              onPress={async () => {
                setLoading(true);
                try {
                  const token = await AsyncStorage.getItem("userToken");
                  const res = await fetch(
                    `http://localhost:3000/api/ho_tro/${supportItem.id}/replies`,
                    {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                      },
                      body: JSON.stringify({ noi_dung: replyText.trim() }),
                    }
                  );
                  if (res.ok) {
                    const newReply = await res.json();
                    addReply(newReply);
                    setReplyText("");
                  }
                } catch {
                  console.warn("Không gửi được phản hồi");
                } finally {
                  setLoading(false);
                }
              }}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={{ color: "#fff", fontWeight: "600" }}>
                  Gửi phản hồi
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ManHinhChiTietHoTro;
