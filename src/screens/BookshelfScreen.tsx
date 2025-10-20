import React, { useState } from "react";
import { View, Text, TouchableOpacity, SafeAreaView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../styles/ThemeContext";
import BorrowedBooksScreen from "../components/BorrowedBooksScreen";
import WishlistScreen from "../components/WishlistScreen";
import CommunityScreen from "../components/CommunityScreen";
import {
  Container,
  Header,
  Title,
  SearchButton,
  SectionHeader,
  SectionTitle,
  SeeMore,
  SectionBlock,
} from "../styles/LibraryScreen.style";

const BookshelfScreen = ({ navigation }: any) => {
  const { theme } = useTheme();
  const [selectedTab, setSelectedTab] = useState("shelf");

  const renderTabContent = () => {
    switch (selectedTab) {
      case "wishlist":
        return <WishlistScreen />;
      case "community":
        return <CommunityScreen />;
      default:
        return <BorrowedBooksScreen navigation={navigation} />;
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <Container>
        <Header>
          <View style={{ width: 40 }} />
          <Title>Kệ sách</Title>
          <SearchButton activeOpacity={0.7}>
            <Ionicons name="search-outline" size={22} color="#222" />
          </SearchButton>
        </Header>

        {/* Tabs */}
        <View
          style={{
            flexDirection: "row",
            borderBottomWidth: 1,
            borderBottomColor: "#e8e8e8",
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
                  selectedTab === tab.key ? "#2aa3a3" : "transparent",
              }}
              onPress={() => setSelectedTab(tab.key)}
            >
              <Text
                style={{
                  color: selectedTab === tab.key ? "#2aa3a3" : "#9b9b9b",
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
      </Container>
    </SafeAreaView>
  );
};

export default BookshelfScreen;
