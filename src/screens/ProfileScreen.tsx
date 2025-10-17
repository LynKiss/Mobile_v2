import React from "react";
import { ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
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
} from "../styles/ProfileScreen.styles";

const ProfileScreen: React.FC<any> = ({ navigation }) => {
  return (
    <Container>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Header>
          <AvatarContainer>
            <Avatar source={{ uri: "https://i.pravatar.cc/300" }} />
          </AvatarContainer>
          <UserName>Nguyễn Văn A</UserName>
          <UserEmail>nguyenvana@email.com</UserEmail>
        </Header>

        <StatsRow>
          <StatCard>
            <Ionicons name="book-outline" size={22} color="#4F46E5" />
            <StatNumber>24</StatNumber>
            <StatLabel>Đã mượn</StatLabel>
          </StatCard>
          <StatCard>
            <Ionicons name="book" size={22} color="#22C55E" />
            <StatNumber>3</StatNumber>
            <StatLabel>Đang mượn</StatLabel>
          </StatCard>
          <StatCard>
            <Ionicons name="star-outline" size={22} color="#F59E0B" />
            <StatNumber>4.9</StatNumber>
            <StatLabel>Đánh giá</StatLabel>
          </StatCard>
        </StatsRow>

        <Section>
          <SectionTitle>Tài khoản</SectionTitle>
          <Option onPress={() => navigation.navigate("EditProfile")}>
            <OptionLeft>
              <OptionIcon>
                <Ionicons name="person-outline" size={20} color="#4F46E5" />
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
                  color="#4F46E5"
                />
              </OptionIcon>
              <OptionLabel>Đổi mật khẩu</OptionLabel>
            </OptionLeft>
            <OptionArrow name="chevron-forward" size={18} color="#A1A1AA" />
          </Option>
        </Section>

        <Section>
          <SectionTitle>Khác</SectionTitle>
          <Option>
            <OptionLeft>
              <OptionIcon>
                <Ionicons
                  name="notifications-outline"
                  size={20}
                  color="#4F46E5"
                />
              </OptionIcon>
              <OptionLabel>Cài đặt thông báo</OptionLabel>
            </OptionLeft>
            <OptionArrow name="chevron-forward" size={18} color="#A1A1AA" />
          </Option>

          <Divider />

          <Option>
            <OptionLeft>
              <OptionIcon>
                <Ionicons name="time-outline" size={20} color="#4F46E5" />
              </OptionIcon>
              <OptionLabel>Lịch sử mượn sách</OptionLabel>
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
                  color="#4F46E5"
                />
              </OptionIcon>
              <OptionLabel>Trợ giúp & Hỗ trợ</OptionLabel>
            </OptionLeft>
            <OptionArrow name="chevron-forward" size={18} color="#A1A1AA" />
          </Option>

          <Divider />

          <Option>
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
