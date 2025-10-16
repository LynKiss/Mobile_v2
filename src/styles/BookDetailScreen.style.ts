import styled from "styled-components/native";
import { Dimensions } from "react-native";
const { width } = Dimensions.get("window");

export const Container = styled.View`
  flex: 1;
  background-color: #fff;
`;

export const Header = styled.View`
  background-color: #2aa3aa;
  flex-direction: row;
  align-items: center;
  padding: 14px 16px;
  border-bottom-left-radius: 16px;
  border-bottom-right-radius: 16px;
  elevation: 5;
`;

export const BackButton = styled.TouchableOpacity`
  padding: 6px;
  margin-right: 10px;
`;

export const HeaderTitle = styled.Text`
  color: #fff;
  font-size: 18px;
  font-weight: 600;
`;

export const CoverImage = styled.Image`
  width: 100%;
  height: 340px;
  border-bottom-left-radius: 24px;
  border-bottom-right-radius: 24px;
`;

export const InfoCard = styled.View`
  background-color: #fff;
  margin: -40px 16px 16px 16px;
  padding: 20px;
  border-radius: 16px;
  elevation: 4;
  shadow-color: #000;
  shadow-opacity: 0.1;
  shadow-radius: 6px;
`;

export const BookTitle = styled.Text`
  font-size: 20px;
  font-weight: 700;
  color: #2aa3aa;
`;

export const BookAuthor = styled.Text`
  color: #555;
  font-size: 15px;
  margin-top: 4px;
`;

export const StarsRow = styled.View`
  flex-direction: row;
  margin-top: 8px;
`;

export const TabContainer = styled.View`
  flex-direction: row;
  justify-content: space-around;
  border-bottom-width: 1px;
  border-color: #eee;
  padding-top: 12px;
`;

export const TabButton = styled.TouchableOpacity`
  align-items: center;
  padding-bottom: 10px;
`;

export const TabText = styled.Text<{ active?: boolean }>`
  font-size: 16px;
  color: ${(p) => (p.active ? "#2aa3aa" : "#888")};
  font-weight: ${(p) => (p.active ? "700" : "500")};
`;

export const TabUnderline = styled.View`
  width: 30px;
  height: 3px;
  background-color: #2aa3aa;
  border-radius: 3px;
  margin-top: 6px;
`;

export const ContentBox = styled.View`
  padding: 16px;
`;

export const Label = styled.Text`
  font-weight: 700;
  color: #2aa3aa;
  margin-bottom: 8px;
  font-size: 16px;
`;

export const Description = styled.Text`
  color: #333;
  font-size: 15px;
  line-height: 22px;
`;

export const ReviewCard = styled.View`
  margin-bottom: 16px;
`;

export const ReviewHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

export const ReviewUser = styled.Text`
  font-weight: 600;
  color: #2aa3aa;
`;

export const ReviewDate = styled.Text`
  color: #888;
`;

export const ReviewText = styled.Text`
  color: #444;
  margin-top: 6px;
  line-height: 20px;
`;

export const RelatedCard = styled.TouchableOpacity`
  width: ${width * 0.38}px;
  margin-right: 12px;
`;

export const RelatedImage = styled.Image`
  width: 100%;
  height: 180px;
  border-radius: 12px;
`;

export const RelatedTitle = styled.Text`
  font-size: 14px;
  font-weight: 600;
  margin-top: 6px;
  color: #333;
`;

export const RelatedAuthor = styled.Text`
  color: #2aa3aa;
  font-size: 13px;
`;
