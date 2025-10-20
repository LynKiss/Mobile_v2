// BookDetailScreen.style.ts
import styled from "styled-components/native";
import { Dimensions } from "react-native";

const { width } = Dimensions.get("window");
export const TAB_COUNT = 3;
export const TAB_WIDTH = width / TAB_COUNT; // numeric width mỗi tab
export const UNDERLINE_WIDTH = 56; // bạn có thể chỉnh lại

export const Container = styled.View`
  padding-top: 32px;
  flex: 1;
  background-color: #ffffff;
`;

/* Header (nút back) */
export const Header = styled.View`
  background-color: transparent;
  padding: 12px 16px;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
`;

export const BackButton = styled.TouchableOpacity`
  padding: 6px;
`;

/* Row chứa ảnh bìa + thông tin */
export const BookRow = styled.View`
  flex-direction: row;
  padding: 16px;
  border-bottom-width: 1px;
  border-color: #f0f0f0;
  background-color: #fff;
`;

export const CoverImage = styled.Image`
  width: 110px;
  height: 170px;
  border-radius: 10px;
  margin-right: 16px;
  background-color: #f2f2f2;
`;

export const InfoSection = styled.View`
  flex: 1;
  justify-content: center;
`;

/* Tiêu đề / tác giả */
export const BookTitle = styled.Text`
  font-size: 18px;
  font-weight: 700;
  color: #111;
`;

export const BookAuthor = styled.Text`
  font-size: 14px;
  color: #2aa3aa;
  margin-top: 6px;
`;

/* Hàng sao / rating */
export const StarsRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 8px;
`;

export const RatingText = styled.Text`
  font-size: 13px;
  color: #777;
  margin-left: 8px;
`;

/* Tag thể loại nhỏ */
export const CategoryTag = styled.Text`
  margin-top: 8px;
  align-self: flex-start;
  background-color: rgba(42, 163, 170, 0.08);
  color: #2aa3aa;
  padding: 6px 10px;
  border-radius: 8px;
  font-size: 13px;
`;

/* Tabs container */
export const TabsContainer = styled.View`
  flex-direction: row;
  position: relative;
  border-bottom-width: 1px;
  border-bottom-color: #eee;
  margin-top: 12px;
  background-color: #fff;
`;

/* Nút tab (mỗi tab chia đều) */
export const TabButton = styled.TouchableOpacity`
  flex: 1;
  align-items: center;
  padding-vertical: 12px;
`;

/* Text tab */
export const TabText = styled.Text<{ active?: boolean }>`
  font-size: 15px;
  font-weight: ${(p) => (p.active ? "700" : "600")};
  color: ${(p) => (p.active ? "#2AA3AA" : "#8C97A3")};
`;

/* Vạch underline (kích thước cố định, animation sẽ thay đổi left bằng Animated style numeric) */
export const TabUnderline = styled.View`
  position: absolute;
  bottom: 6px;
  left: 0px;
  width: ${UNDERLINE_WIDTH}px;
  height: 3px;
  background-color: #2aa3aa;
  border-radius: 3px;
`;

/* dividing line */
export const Divider = styled.View`
  height: 8px;
  background-color: #fafafa;
`;

/* Info blocks */
export const InfoBlock = styled.View`
  padding: 14px 16px;
  background-color: #fff;
  border-bottom-width: 1px;
  border-color: #f6f6f6;
`;

export const InfoLabel = styled.Text`
  font-size: 13px;
  font-weight: 700;
  color: #222;
  margin-bottom: 6px;
`;

export const InfoValue = styled.Text`
  font-size: 14px;
  color: #666;
  line-height: 20px;
`;

/* Bottom action buttons (fixed) */
export const BottomButtons = styled.View`
  position: absolute;
  bottom: 18px;
  left: 16px;
  right: 16px;
  flex-direction: row;
`;

export const WishlistButton = styled.TouchableOpacity`
  flex: 1;
  background-color: #2aa3aa;
  padding: 12px;
  border-radius: 10px;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
  flex-direction: row;
`;

export const ShelfButton = styled.TouchableOpacity`
  flex: 1;
  background-color: #fff;
  border: 1.5px solid #2aa3aa;
  padding: 12px;
  border-radius: 10px;
  align-items: center;
  justify-content: center;
  flex-direction: row;
`;

export const ButtonText = styled.Text`
  font-size: 14px;
  font-weight: 700;
  color: #fff;
  margin-left: 8px;
`;

/* Related list helpers (you may use these or inline styles) */
export const RelatedContainer = styled.View`
  padding: 12px 8px 28px;
  background-color: #fff;
`;

export const RelatedBook = styled.View`
  width: 120px;
  align-items: center;
  margin-right: 12px;
`;

export const RelatedImage = styled.Image`
  width: 100%;
  height: 170px;
  border-radius: 10px;
  background-color: #f2f2f2;
`;

export const RelatedTitle = styled.Text`
  font-size: 13px;
  color: #222;
  text-align: center;
  margin-top: 6px;
`;

/* Review item helpers (optional) */
export const ReviewItem = styled.View`
  background-color: #fbfbfb;
  margin: 8px 12px;
  padding: 12px;
  border-radius: 10px;
`;

export const ReviewUser = styled.Text`
  font-weight: 700;
  color: #2aa3aa;
`;

export const ReviewText = styled.Text`
  color: #444;
  margin-top: 6px;
  line-height: 20px;
`;

/* Modal box helpers */
export const ModalBox = styled.View`
  width: 100%;
  background-color: #fff;
  border-radius: 12px;
  padding: 18px;
`;

export const ModalTitle = styled.Text`
  font-size: 16px;
  font-weight: 700;
  color: #222;
  margin-bottom: 8px;
`;

export const ModalBody = styled.Text`
  color: #444;
  line-height: 20px;
`;

export const CloseModalBtn = styled.TouchableOpacity`
  margin-top: 12px;
  align-self: flex-end;
  background-color: #2aa3aa;
  padding: 8px 12px;
  border-radius: 8px;
`;
