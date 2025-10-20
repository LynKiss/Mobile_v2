// src/screens/FineScreen.tsx
import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  Modal,
  Pressable,
  Linking,
  Animated,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../contexts/AuthContext";
import { API_URL } from "../Api/config";

// Types
interface Fine {
  ma_phat: number;
  so_tien: number;
  so_duoc_thanh_toan: number;
  con_no: number;
  ly_do: string;
  ngay_danh_gia?: string; // or ngay_phat
  ngay_phat?: string;
  ngay_tao?: string;
  trang_thai: string;
}

const currency = (v: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    v
  );

const FineScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user } = useAuth();
  const [fines, setFines] = useState<Fine[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [creatingPayment, setCreatingPayment] = useState<boolean>(false);
  const [selectedFine, setSelectedFine] = useState<Fine | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<"unpaid" | "paid">("unpaid");
  const animValues = useRef<Record<number, Animated.Value>>({}).current;

  // get token helper
  const getToken = async () => {
    try {
      const t = await AsyncStorage.getItem("userToken");
      return t ?? "";
    } catch (err) {
      return "";
    }
  };

  useEffect(() => {
    fetchFines();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchFines = useCallback(async () => {
    setLoading(true);
    try {
      if (!user?.ma_nguoi_dung) {
        setFines([]);
        setLoading(false);
        return;
      }
      const token = await getToken();
      const resp = await fetch(
        `${API_URL}/api/phat/user/${user.ma_nguoi_dung}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!resp.ok) {
        const text = await resp.text();
        console.error("Fetch fines failed:", resp.status, text);
        Alert.alert("Lỗi", "Không thể tải danh sách phạt. Vui lòng thử lại.");
        setFines([]);
        setLoading(false);
        return;
      }

      // support both { data: [...] } or direct array
      const json = await resp.json();
      const list: Fine[] = Array.isArray(json) ? json : json.data ?? [];

      // initialize anim values
      list.forEach((f) => {
        if (!animValues[f.ma_phat])
          animValues[f.ma_phat] = new Animated.Value(0);
      });

      setFines(list);
    } catch (err) {
      console.error("Error fetching fines:", err);
      Alert.alert("Lỗi", "Có lỗi xảy ra khi tải dữ liệu.");
    } finally {
      setLoading(false);
    }
  }, [user, animValues]);

  const onPressPay = (fine: Fine) => {
    setSelectedFine(fine);
    setModalVisible(true);
  };

  const openPaymentUrl = (url: string) => {
    if (Platform.OS === "web") {
      window.open(url, "_blank");
    } else {
      Linking.openURL(url).catch((err) => {
        console.error("Cannot open url", err);
        Alert.alert("Lỗi", "Không thể mở trình duyệt để thanh toán");
      });
    }
  };

  const doPayment = async () => {
    if (!selectedFine) return;
    setCreatingPayment(true);
    try {
      const token = await getToken();
      const payload = {
        ma_nguoi_dung: user?.ma_nguoi_dung,
        so_tien: selectedFine.con_no,
      };

      const resp = await fetch(`${API_URL}/api/payment/momo/pay`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!resp.ok) {
        const errJson = await resp.json().catch(() => null);
        const errMsg = errJson?.error || `Lỗi server ${resp.status}`;
        throw new Error(errMsg);
      }

      const data = await resp.json();
      const url = data.payUrl || data.redirectUrl || data.url;
      if (!url) {
        throw new Error("Không nhận được liên kết thanh toán từ server");
      }

      setModalVisible(false);
      setTimeout(() => openPaymentUrl(url), 300);
    } catch (err: any) {
      console.error("Payment creation error:", err);
      Alert.alert("Lỗi thanh toán", err.message || "Không thể tạo thanh toán");
    } finally {
      setCreatingPayment(false);
    }
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="checkmark-circle-outline" size={84} color="#22C55E" />
      <Text style={styles.emptyTitle}>Bạn không có khoản phạt nào</Text>
      <Text style={styles.emptySub}>
        Tuyệt vời! Hãy tiếp tục mượn sách nhé 📚
      </Text>
      <TouchableOpacity
        style={styles.primaryBtn}
        onPress={() => navigation.goBack?.()}
        accessibilityLabel="Quay lại"
      >
        <Text style={styles.primaryBtnText}>Quay về Thư viện</Text>
      </TouchableOpacity>
    </View>
  );

  const renderSkeleton = () => {
    return (
      <View style={{ padding: 16 }}>
        {Array.from({ length: 3 }).map((_, i) => (
          <View key={i} style={styles.cardSkeleton}>
            <View style={styles.skelHeader} />
            <View style={styles.skelLine} />
            <View style={[styles.skelLine, { width: "60%" }]} />
          </View>
        ))}
      </View>
    );
  };

  const startCardAnim = (ma_phat: number) => {
    const a = animValues[ma_phat];
    if (!a) return;
    a.setValue(0);
    Animated.timing(a, {
      toValue: 1,
      duration: 420,
      useNativeDriver: true,
    }).start();
  };

  const handleTabChange = (tab: "unpaid" | "paid") => {
    setActiveTab(tab);
  };

  const getFilteredFines = () => {
    if (activeTab === "unpaid") {
      return fines.filter((fine) => fine.con_no > 0);
    } else {
      return fines.filter((fine) => fine.con_no === 0);
    }
  };

  const renderFine = ({ item }: { item: Fine }) => {
    // start animation when rendered
    startCardAnim(item.ma_phat);
    const anim = animValues[item.ma_phat] ?? new Animated.Value(1);
    const translateY = anim.interpolate({
      inputRange: [0, 1],
      outputRange: [8, 0],
    });
    const opacity = anim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    });

    // status color
    const status = (item.trang_thai || "").toLowerCase();
    const statusColor =
      status.includes("đã") || status.includes("paid")
        ? "#10B981"
        : status.includes("chờ") || status.includes("pending")
        ? "#F59E0B"
        : "#EF4444";

    return (
      <Animated.View
        style={[styles.card, { transform: [{ translateY }], opacity }]}
        accessible
        accessibilityLabel={`Phạt ${item.ma_phat}, còn nợ ${item.con_no}`}
      >
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.cardTitle}>Phạt #{item.ma_phat}</Text>
            <Text style={styles.cardSubtitle} numberOfLines={2}>
              {item.ly_do || "Không có mô tả"}
            </Text>
          </View>

          <View style={styles.statusWrap}>
            <View
              style={[styles.statusDot, { backgroundColor: statusColor }]}
            />
            <Text style={[styles.statusText, { color: statusColor }]}>
              {item.trang_thai}
            </Text>
          </View>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Ngày phạt</Text>
          <Text style={styles.value}>
            {new Date(
              item.ngay_phat ||
                item.ngay_tao ||
                item.ngay_danh_gia ||
                Date.now()
            ).toLocaleDateString("vi-VN")}
          </Text>
        </View>

        <View style={[styles.row, { marginTop: 8 }]}>
          <View>
            <Text style={styles.smallLabel}>Còn nợ</Text>
            <Text style={styles.debt}>{currency(item.con_no)}</Text>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={styles.smallLabel}>Đã trả</Text>
            <Text style={styles.paid}>{currency(item.so_duoc_thanh_toan)}</Text>
          </View>
        </View>

        {item.con_no > 0 ? (
          <View style={styles.cardFooter}>
            <TouchableOpacity
              onPress={() => onPressPay(item)}
              style={styles.payBtn}
              accessibilityLabel={`Thanh toán ${item.con_no} đồng cho phạt ${item.ma_phat}`}
            >
              <Ionicons name="card-outline" size={18} color="#fff" />
              <Text style={styles.payBtnText}>
                Thanh toán {currency(item.con_no)}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.cardFooter}>
            <Text style={styles.paidNote}>Khoản phạt đã được thanh toán</Text>
          </View>
        )}
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack?.()}
          style={styles.backBtn}
          accessibilityLabel="Quay lại"
        >
          <Ionicons name="arrow-back" size={20} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Phạt & Thanh toán</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          onPress={() => handleTabChange("unpaid")}
          style={[styles.tab, activeTab === "unpaid" && styles.activeTab]}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "unpaid" && styles.activeTabText,
            ]}
          >
            Chưa thanh toán
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleTabChange("paid")}
          style={[styles.tab, activeTab === "paid" && styles.activeTab]}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "paid" && styles.activeTabText,
            ]}
          >
            Đã thanh toán
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {loading ? (
          renderSkeleton()
        ) : getFilteredFines().length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons
              name={
                activeTab === "unpaid"
                  ? "card-outline"
                  : "checkmark-circle-outline"
              }
              size={84}
              color="#22C55E"
            />
            <Text style={styles.emptyTitle}>
              {activeTab === "unpaid"
                ? "Không có khoản phạt chưa thanh toán"
                : "Không có khoản phạt đã thanh toán"}
            </Text>
            <Text style={styles.emptySub}>
              {activeTab === "unpaid"
                ? "Bạn đã thanh toán tất cả các khoản phạt"
                : "Các khoản phạt đã thanh toán sẽ xuất hiện ở đây"}
            </Text>
          </View>
        ) : (
          <FlatList
            data={getFilteredFines()}
            keyExtractor={(i) => String(i.ma_phat)}
            renderItem={renderFine}
            contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
            ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      {/* Payment confirmation modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setModalVisible(false)}
        />
        <View style={styles.modalWrapper}>
          <Text style={styles.modalTitle}>Xác nhận thanh toán</Text>
          <Text style={styles.modalText}>
            Bạn sẽ được chuyển tới cổng thanh toán để hoàn tất. Số tiền cần
            thanh toán:{" "}
            <Text style={{ fontWeight: "700" }}>
              {selectedFine ? currency(selectedFine.con_no) : ""}
            </Text>
          </Text>

          <View
            style={{
              flexDirection: "row",
              marginTop: 20,
              justifyContent: "space-between",
            }}
          >
            <TouchableOpacity
              style={styles.modalCancelBtn}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalCancelText}>Hủy</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.modalConfirmBtn,
                creatingPayment && { opacity: 0.8 },
              ]}
              onPress={doPayment}
              accessibilityLabel="Xác nhận thanh toán"
            >
              {creatingPayment ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.modalConfirmText}>Thanh toán</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default FineScreen;

// Styles
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  header: {
    paddingTop: Platform.OS === "ios" ? 52 : 20,
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: "#fff",
    borderBottomColor: "#E6E9EE",
    borderBottomWidth: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#2AA3A3",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    marginLeft: 12,
    fontSize: 20,
    fontWeight: "700",
    color: "#0F172A",
  },
  tabs: {
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E6E9EE",
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 4,
  },
  activeTab: {
    backgroundColor: "#2AA3A3",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
  },
  activeTabText: {
    color: "#fff",
  },
  content: { flex: 1 },

  // Card
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 16,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardTitle: { fontSize: 16, fontWeight: "800", color: "#0F172A" },
  cardSubtitle: { fontSize: 13, color: "#6B7280", marginTop: 4, maxWidth: 280 },

  statusWrap: { alignItems: "flex-end" },
  statusDot: { width: 10, height: 10, borderRadius: 6, marginBottom: 6 },
  statusText: { fontSize: 12, fontWeight: "700" },

  row: { flexDirection: "row", justifyContent: "space-between", marginTop: 12 },
  label: { color: "#6B7280", fontSize: 13 },
  value: { fontSize: 14, fontWeight: "700", color: "#0F172A" },

  smallLabel: { color: "#6B7280", fontSize: 13 },
  debt: { color: "#EF4444", fontSize: 16, fontWeight: "800", marginTop: 4 },
  paid: { color: "#10B981", fontSize: 16, fontWeight: "800", marginTop: 4 },

  cardFooter: {
    marginTop: 14,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  payBtn: {
    backgroundColor: "#2AA3A3",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  payBtnText: { color: "#fff", fontWeight: "800", marginLeft: 8 },

  paidNote: { color: "#6B7280", fontWeight: "700" },

  // skeleton
  cardSkeleton: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
  },
  skelHeader: {
    width: 160,
    height: 18,
    backgroundColor: "#F1F5F9",
    borderRadius: 8,
    marginBottom: 12,
  },
  skelLine: {
    width: "100%",
    height: 12,
    backgroundColor: "#F1F5F9",
    borderRadius: 6,
    marginBottom: 8,
  },

  // empty
  emptyContainer: { padding: 28, alignItems: "center" },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "800",
    marginTop: 12,
    color: "#0F172A",
  },
  emptySub: { color: "#6B7280", marginTop: 8, textAlign: "center" },

  primaryBtn: {
    marginTop: 18,
    backgroundColor: "#2AA3A3",
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 10,
  },
  primaryBtnText: { color: "#fff", fontWeight: "800" },

  // modal
  modalBackdrop: { flex: 1, backgroundColor: "rgba(2,6,23,0.5)" },
  modalWrapper: {
    position: "absolute",
    left: 32,
    right: 32,
    top: "35%",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 20,
    elevation: 6,
  },
  modalTitle: { fontSize: 18, fontWeight: "800", marginBottom: 6 },
  modalText: { color: "#374151", fontSize: 14 },
  modalCancelBtn: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E6E9EE",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 10,
  },
  modalCancelText: { color: "#374151", fontWeight: "700" },
  modalConfirmBtn: {
    backgroundColor: "#2AA3A3",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  modalConfirmText: { color: "#fff", fontWeight: "800" },
});
