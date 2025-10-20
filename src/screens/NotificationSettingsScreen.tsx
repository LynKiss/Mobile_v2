import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const NotificationSettingsScreen = ({ navigation }: any) => {
  const [settings, setSettings] = useState({
    bookDue: true,
    newBooks: false,
    promotions: true,
    reminders: true,
    systemUpdates: false,
  });

  const updateSetting = (key: string, value: boolean) => {
    setSettings({ ...settings, [key]: value });
  };

  const SettingItem = ({
    title,
    subtitle,
    value,
    onValueChange,
  }: {
    title: string;
    subtitle: string;
    value: boolean;
    onValueChange: (value: boolean) => void;
  }) => (
    <View style={styles.settingItem}>
      <View style={styles.settingText}>
        <Text style={styles.settingTitle}>{title}</Text>
        <Text style={styles.settingSubtitle}>{subtitle}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: "#767577", true: "#2AA3AA" }}
        thumbColor={value ? "#fff" : "#f4f3f4"}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#2AA3AA" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cài đặt thông báo</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Thông báo về sách</Text>
        <SettingItem
          title="Hạn trả sách"
          subtitle="Nhắc nhở khi sách sắp đến hạn trả"
          value={settings.bookDue}
          onValueChange={(value) => updateSetting("bookDue", value)}
        />
        <SettingItem
          title="Sách mới"
          subtitle="Thông báo khi có sách mới trong thư viện"
          value={settings.newBooks}
          onValueChange={(value) => updateSetting("newBooks", value)}
        />

        <Text style={styles.sectionTitle}>Khuyến mãi & Ưu đãi</Text>
        <SettingItem
          title="Khuyến mãi"
          subtitle="Thông báo về các chương trình khuyến mãi"
          value={settings.promotions}
          onValueChange={(value) => updateSetting("promotions", value)}
        />

        <Text style={styles.sectionTitle}>Hệ thống</Text>
        <SettingItem
          title="Nhắc nhở"
          subtitle="Thông báo nhắc nhở chung"
          value={settings.reminders}
          onValueChange={(value) => updateSetting("reminders", value)}
        />
        <SettingItem
          title="Cập nhật hệ thống"
          subtitle="Thông báo về các bản cập nhật ứng dụng"
          value={settings.systemUpdates}
          onValueChange={(value) => updateSetting("systemUpdates", value)}
        />
      </ScrollView>
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
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1D1D1F",
    marginTop: 24,
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1D1D1F",
    marginBottom: 4,
  },
  settingSubtitle: {
    fontSize: 14,
    color: "#6B6B6B",
  },
});

export default NotificationSettingsScreen;
