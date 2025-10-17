import React, { useState } from "react";
import { View, Text, TouchableOpacity, SafeAreaView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../styles/ThemeContext";
import BorrowedBooksScreen from "../components/BorrowedBooksScreen";
import WishlistScreen from "../components/WishlistScreen";
import CommunityScreen from "../components/CommunityScreen";

const BookshelfScreen = () => {
  const { theme } = useTheme();
  const [selectedTab, setSelectedTab] = useState("shelf");

  const renderTabContent = () => {
    switch (selectedTab) {
      case "wishlist":
        return <WishlistScreen />;
      case "community":
        return <CommunityScreen />;
      default:
        return <BorrowedBooksScreen />;
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
      }}
    >
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.border,
          backgroundColor: "#fff",
        }}
      >
        <Text
          style={{
            fontSize: 22,
            fontWeight: "700",
            color: theme.colors.text,
          }}
        >
          Kệ sách
        </Text>
        <Ionicons
          name="ellipsis-vertical"
          size={20}
          color={theme.colors.textSecondary}
        />
      </View>

      {/* Tabs */}
      <View
        style={{
          flexDirection: "row",
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.border,
          backgroundColor: "#fff",
        }}
      >
        {[
          { key: "shelf", label: "Kệ sách" },
          { key: "wishlist", label: "Wishlist" },
          { key: "community", label: "Cộng đồng" },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={{
              flex: 1,
              alignItems: "center",
              paddingVertical: 12,
              borderBottomWidth: 2,
              borderBottomColor:
                selectedTab === tab.key ? theme.colors.primary : "transparent",
            }}
            onPress={() => setSelectedTab(tab.key)}
          >
            <Text
              style={{
                color:
                  selectedTab === tab.key
                    ? theme.colors.primary
                    : theme.colors.textSecondary,
                fontWeight: selectedTab === tab.key ? "700" : "500",
                fontSize: 16,
              }}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Tab content */}
      <View style={{ flex: 1 }}>{renderTabContent()}</View>
    </SafeAreaView>
  );
};

export default BookshelfScreen;
