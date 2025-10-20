import React, { useState, useEffect } from "react";
import { ScrollView, View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../contexts/AuthContext";
import { API_URL } from "../Api/config";
import {
  Container,
  Header,
  AvatarContainer,
  Avatar,
  UserName,
  UserEmail,
  StatsRow,
  StatCard,
  StatNumber,
  StatLabel,
  Section,
  SectionTitle,
  Option,
  OptionLeft,
  OptionLabel,
  OptionIcon,
  OptionArrow,
  Divider,
  NotificationIcon,
} from "../styles/ProfileScreen.styles";

const ProfileScreen: React.FC<any> = ({ navigation }) => {
  const { logout } = useAuth();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        const userString = await AsyncStorage.getItem("user");
        if (!token || !userString) return;
        const user = JSON.parse(userString);
        const userId = user.ma_nguoi_dung;
        const response = await fetch(
          `${API_URL}/api/nguoi_dung/home/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (response.ok) {
          const data = await response.json();
          setUserData(data);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchUnreadCount = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        const userString = await AsyncStorage.getItem("user");
        if (!token || !userString) return;
        const user = JSON.parse(userString);
        const userId = user.ma_nguoi_dung;
        const response = await fetch(
          `${API_URL}/api/notifications/unread-count?ma_nguoi_dung=${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (response.ok) {
          const data = await response.json();
          setUnreadCount(data.unread_count);
        }
      } catch (error) {
        console.error("Error fetching unread count:", error);
      }
    };

    fetchUserData();
    fetchUnreadCount();
  }, []);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <Container>
      <NotificationIcon
        onPress={() => navigation.navigate("Notifications")}
      >
        <Ionicons name="notifications-outline" size={20} color="#fff" />
        {unreadCount > 0 && (
          <View style={{
            position: 'absolute',
            top: -5,
            right: -5,
            backgroundColor: '#EF4444',
            borderRadius: 10,
            minWidth: 20,
            height: 20,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 5,
          }}>
            <Text style={{
              color: '#fff',
              fontSize: 12,
              fontWeight: 'bold',
            }}>
              {unreadCount > 99 ? '99+' : unreadCount}
            </Text>
          </View>
        )}
      </NotificationIcon>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Header>
          <AvatarContainer>
            <Avatar
              source={{ uri: userData?.avatar || "https://i.pravatar.cc/300" }}
            />
          </AvatarContainer>
          <UserName>{userData?.ho_ten || "Nguyễn Văn A"}</UserName>
          <UserEmail>{userData?.rank_name || "nguyenvana@email.com"}</UserEmail>
        </Header>

        <StatsRow>
          <StatCard>
            <Ionicons name="book-outline" size={22} color="#4F46E5" />
            <StatNumber>{userData?.total_borrowed || 0}</StatNumber>
            <StatLabel>Tổng mượn</StatLabel>
          </StatCard>
          <StatCard>
            <Ionicons name="book" size={22} color="#22C55E" />
            <StatNumber>{userData?.currently_borrowed || 0}</StatNumber>
            <StatLabel>Đang mượn</StatLabel>
          </StatCard>
          <StatCard>
            <Ionicons name="star-outline" size={22} color="#F59E0B" />
            <StatNumber>{userData?.avg_rating || 0}</StatNumber>
            <StatLabel>Đánh giá</StatLabel>
          </StatCard>
        </StatsRow>

        <Section>
          <SectionTitle>Tài khoản</SectionTitle>
          <Option onPress={() => navigation.navigate("EditProfile")}>
            <OptionLeft>
              <OptionIcon>
                <Ionicons name="person-outline" size={20} color="#2aa3a3" />
              </OptionIcon>
              <OptionLabel>Chỉnh sửa hồ sơ</OptionLabel>
            </OptionLeft>
            <OptionArrow name="chevron-forward" size={18} color="#A1A1AA" />
          </Option>

          <Divider />

          <Option>
            <OptionLeft>
              <OptionIcon>
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color="#2aa3a3"
                />
              </OptionIcon>
              <OptionLabel>Đổi mật khẩu</OptionLabel>
            </OptionLeft>
            <OptionArrow name="chevron-forward" size={18} color="#A1A1AA" />
          </Option>
        </Section>

        <Section>
          <SectionTitle>Khác</SectionTitle>
          <Option onPress={() => navigation.navigate("NotificationSettings")}>
            <OptionLeft>
              <OptionIcon>
                <Ionicons
                  name="notifications-outline"
                  size={20}
                  color="#2aa3a3"
                />
              </OptionIcon>
              <OptionLabel>Cài đặt thông báo</OptionLabel>
            </OptionLeft>
            <OptionArrow name="chevron-forward" size={18} color="#A1A1AA" />
          </Option>

          <Divider />

          <Option onPress={() => navigation.navigate("BorrowingHistory")}>
            <OptionLeft>
              <OptionIcon>
                <Ionicons name="time-outline" size={20} color="#2aa3a3" />
              </OptionIcon>
              <OptionLabel>Lịch sử mượn sách</OptionLabel>
            </OptionLeft>
            <OptionArrow name="chevron-forward" size={18} color="#A1A1AA" />
          </Option>

          <Divider />

          <Option onPress={() => navigation.navigate("FineScreen")}>
            <OptionLeft>
              <OptionIcon>
                <Ionicons
                  name="document-text-outline"
                  size={20}
                  color="#2aa3a3"
                />
              </OptionIcon>
              <OptionLabel>Phạt & Thanh toán</OptionLabel>
            </OptionLeft>
            <OptionArrow name="chevron-forward" size={18} color="#A1A1AA" />
          </Option>

          <Divider />

          <Option onPress={() => navigation.navigate("Help")}>
            <OptionLeft>
              <OptionIcon>
                <Ionicons
                  name="help-circle-outline"
                  size={20}
                  color="#2aa3a3"
                />
              </OptionIcon>
              <OptionLabel>Trợ giúp & Hỗ trợ</OptionLabel>
            </OptionLeft>
            <OptionArrow name="chevron-forward" size={18} color="#A1A1AA" />
          </Option>

          <Divider />

          <Option onPress={handleLogout}>
            <OptionLeft>
              <OptionIcon>
                <Ionicons name="log-out-outline" size={20} color="#EF4444" />
              </OptionIcon>
              <OptionLabel style={{ color: "#EF4444" }}>Đăng xuất</OptionLabel>
            </OptionLeft>
          </Option>
        </Section>
      </ScrollView>
    </Container>
  );
};

export default ProfileScreen;
