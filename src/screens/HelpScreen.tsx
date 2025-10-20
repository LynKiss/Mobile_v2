import React from "react";
import {
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking,
  SafeAreaView,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styled from "styled-components/native";

const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: #ffffff;
`;

const Header = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 16px 20px;
  border-bottom-width: 1px;
  border-bottom-color: #f2f2f2;
`;

const Title = styled.Text`
  flex: 1;
  text-align: center;
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  font-family: "System";
`;

const Section = styled.View`
  padding: 20px;
`;

const Heading = styled.Text`
  font-size: 22px;
  font-weight: 700;
  color: #111827;
  text-align: center;
  margin-bottom: 8px;
`;

const SubHeading = styled.Text`
  font-size: 15px;
  color: #6b7280;
  text-align: center;
  line-height: 22px;
`;

const Card = styled.View`
  background-color: #fff;
  border-radius: 14px;
  margin-bottom: 16px;
  padding: 16px;
  flex-direction: row;
  align-items: center;
  shadow-color: #000;
  shadow-opacity: 0.05;
  shadow-radius: 3px;
  shadow-offset: 0px 2px;
  elevation: 2;
`;

const IconContainer = styled.View<{ color: string }>`
  width: 46px;
  height: 46px;
  border-radius: 12px;
  justify-content: center;
  align-items: center;
  background-color: ${({ color }) => color};
  margin-right: 16px;
`;

const CardContent = styled.View`
  flex: 1;
`;

const CardTitle = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 4px;
  font-family: "System";
`;

const CardDesc = styled.Text`
  font-size: 14px;
  color: #6b7280;
  line-height: 20px;
`;

const Footer = styled.View`
  background-color: #fff;
  border-radius: 14px;
  padding: 20px;
  margin: 20px;
  align-items: center;
  shadow-color: #000;
  shadow-opacity: 0.05;
  shadow-radius: 3px;
  shadow-offset: 0px 2px;
  elevation: 2;
`;

const FooterText = styled.Text`
  font-size: 14px;
  color: #6b7280;
  text-align: center;
  line-height: 20px;
  margin-top: 8px;
`;

const HelpScreen = ({ navigation }: any) => {
  const handleFAQ = () => {
    Alert.alert(
      "Câu hỏi thường gặp",
      "1️⃣ Đăng nhập: nhập email + mật khẩu\n\n2️⃣ Quên mật khẩu: Nhấn 'Quên mật khẩu' > nhập email\n\n3️⃣ Tìm kiếm: dùng thanh tìm kiếm hoặc lọc theo thể loại\n\n4️⃣ Mượn sách: chọn sách > thêm vào giỏ > xác nhận\n\n5️⃣ Gia hạn: vào Lịch sử > chọn sách > Gia hạn"
    );
  };

  const handleGuide = () => {
    Alert.alert(
      "Hướng dẫn sử dụng",
      "📘 Mượn sách: Tìm > Thêm vào giỏ > Đặt chỗ\n📗 Trả sách: Vào Lịch sử > Trả sách\n📙 Gia hạn: Trước khi hết hạn 3 ngày\n📒 Đặt chỗ: Khi sách đang được mượn\n⭐ Đánh giá: Sau khi trả sách"
    );
  };

  const handleError = () => navigation.navigate("HelpMain");

  const handleChatbot = () => navigation.navigate("ChatBox");

  const handleContact = () => {
    Alert.alert(
      "Trung tâm liên hệ",
      "📞 Hotline: 1900-XXXX (8:00–17:00)\n📧 Email: support@library.com\n🏢 Địa chỉ: 123 Đường ABC, Quận XYZ, TP.HCM",
      [
        { text: "Gọi", onPress: () => Linking.openURL("tel:1900XXXX") },
        {
          text: "Gửi email",
          onPress: () => Linking.openURL("mailto:support@library.com"),
        },
        { text: "Đóng", style: "cancel" },
      ]
    );
  };

  const HelpItem = ({
    title,
    icon,
    description,
    color,
    onPress,
  }: {
    title: string;
    icon: any;
    description: string;
    color: string;
    onPress: () => void;
  }) => (
    <TouchableOpacity onPress={onPress}>
      <Card>
        <IconContainer color={color}>
          <Ionicons name={icon} size={24} color="#fff" />
        </IconContainer>
        <CardContent>
          <CardTitle>{title}</CardTitle>
          <CardDesc>{description}</CardDesc>
        </CardContent>
        <Ionicons name="chevron-forward" size={18} color="#9ca3af" />
      </Card>
    </TouchableOpacity>
  );

  return (
    <Container>
      <Header>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Title>Trợ giúp & Hỗ trợ</Title>
        <View style={{ width: 24 }} />
      </Header>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Section>
          <Heading>Chúng tôi luôn sẵn sàng hỗ trợ!</Heading>
          <SubHeading>
            Tìm câu trả lời nhanh hoặc liên hệ với đội ngũ hỗ trợ chuyên nghiệp
            của chúng tôi.
          </SubHeading>
        </Section>

        <Section>
          <HelpItem
            title="Câu hỏi thường gặp"
            icon="help-circle-outline"
            description="Hướng dẫn đăng nhập, tìm kiếm, mượn trả sách và xử lý lỗi cơ bản."
            color="#3B82F6"
            onPress={handleFAQ}
          />

          <HelpItem
            title="Hướng dẫn sử dụng"
            icon="book-outline"
            description="Video, hình minh họa và bước sử dụng ứng dụng chi tiết."
            color="#10B981"
            onPress={handleGuide}
          />

          <HelpItem
            title="Báo lỗi / Yêu cầu hỗ trợ"
            icon="bug-outline"
            description="Gửi báo cáo lỗi hoặc yêu cầu giúp đỡ từ nhân viên thư viện."
            color="#EF4444"
            onPress={handleError}
          />

          <HelpItem
            title="Chatbot hỗ trợ"
            icon="chatbubble-ellipses-outline"
            description="Trò chuyện trực tiếp với chatbot để nhận hỗ trợ tức thì."
            color="#F59E0B"
            onPress={handleChatbot}
          />

          <HelpItem
            title="Trung tâm liên hệ"
            icon="call-outline"
            description="Hotline, email và địa chỉ liên hệ trực tiếp với thư viện."
            color="#8B5CF6"
            onPress={handleContact}
          />
        </Section>

        <Footer>
          <Ionicons name="heart-outline" size={30} color="#3B82F6" />
          <CardTitle style={{ marginTop: 8 }}>Cảm ơn bạn đã sử dụng!</CardTitle>
          <FooterText>
            Chúng tôi cam kết mang đến trải nghiệm tốt nhất cho bạn. Nếu có góp
            ý, hãy liên hệ với chúng tôi 💬
          </FooterText>
        </Footer>
      </ScrollView>
    </Container>
  );
};

export default HelpScreen;
