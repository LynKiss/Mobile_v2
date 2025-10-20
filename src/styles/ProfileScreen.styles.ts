import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";

export const Container = styled.View`
  padding-top: 32px;
  flex: 1;
  background-color: #ffffff;
`;

export const Header = styled.View`
  align-items: center;
  padding: 32px 0 16px;
  background-color: #ffffff;
`;

export const AvatarContainer = styled.View`
  border-radius: 60px;
  padding: 4px;
  background-color: #ffffff;
  elevation: 3;
  shadow-color: #000;
  shadow-opacity: 0.08;
  shadow-radius: 4px;
  shadow-offset: 0px 2px;
`;

export const Avatar = styled.Image`
  width: 96px;
  height: 96px;
  border-radius: 48px;
`;

export const UserName = styled.Text`
  font-size: 20px;
  font-weight: 600;
  color: #111827;
  margin-top: 12px;
  font-family: "System"; /* 🧠 Font mặc định iOS */
`;

export const UserEmail = styled.Text`
  font-size: 14px;
  color: #6b7280;
  margin-top: 4px;
`;

export const StatsRow = styled.View`
  flex-direction: row;
  justify-content: space-around;
  margin: 20px 16px;
`;

export const StatCard = styled.View`
  background-color: #ffffff;
  align-items: center;
  padding: 12px;
  border-radius: 12px;
  width: 30%;
  elevation: 2;
  shadow-color: #000;
  shadow-opacity: 0.05;
  shadow-radius: 3px;
  shadow-offset: 0px 2px;
`;

export const StatNumber = styled.Text`
  font-size: 18px;
  font-weight: 700;
  color: #111827;
  margin-top: 6px;
`;

export const StatLabel = styled.Text`
  font-size: 13px;
  color: #6b7280;
  margin-top: 2px;
`;

export const Section = styled.View`
  background-color: #ffffff;
  margin: 8px 16px;
  border-radius: 12px;
  elevation: 2;
  shadow-color: #000;
  shadow-opacity: 0.05;
  shadow-radius: 3px;
  shadow-offset: 0px 2px;
  overflow: hidden;
`;

export const SectionTitle = styled.Text`
  font-size: 15px;
  font-weight: 600;
  color: #374151;
  padding: 12px 16px;
`;

export const Option = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 14px 16px;
  background-color: #ffffff;
`;

export const OptionLeft = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const OptionIcon = styled.View`
  margin-right: 12px;
`;

export const OptionLabel = styled.Text`
  font-size: 15px;
  color: #111827;
`;

export const OptionArrow = styled(Ionicons)``;

export const Divider = styled.View`
  height: 1px;
  background-color: #f3f4f6;
  margin-left: 52px;
`;

export const NotificationIcon = styled.TouchableOpacity`
  position: absolute;
  top: 16px;
  right: 16px;
  background-color: #2aa3a3;
  width: 40px;
  height: 40px;
  border-radius: 20px;
  justify-content: center;
  align-items: center;
  elevation: 4;
  shadow-color: #000;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  shadow-offset: 0px 2px;
  z-index: 10;
`;
