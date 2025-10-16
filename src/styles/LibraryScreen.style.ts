import styled from "styled-components/native";

// 📱 Toàn trang
export const Container = styled.View`
  flex: 1;
  background-color: #f5f7fa; /* nền sáng mềm toàn trang */
`;

// 📌 Header
export const Header = styled.View`
  height: 64px;

  padding-horizontal: 16px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background-color: #ffffff;
  border-bottom-width: 0.5px;
  border-bottom-color: #e8e8e8;
`;

export const Title = styled.Text`
  font-size: 18px;
  font-weight: 600;
  color: #222222;
`;

export const SearchButton = styled.TouchableOpacity`
  width: 40px;
  align-items: center;
  justify-content: center;
`;

// 🖼 Banner
export const BannerWrap = styled.View`
  width: 100%;
  height: 190px;
  background-color: #f2f2f2;
`;

export const BannerImage = styled.Image`
  width: 100%;
  height: 190px;
`;

export const DotsRow = styled.View`
  position: absolute;
  bottom: 12px;
  left: 0;
  right: 0;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

export const Dot = styled.View<{ active?: boolean }>`
  width: ${(p) => (p.active ? 8 : 6)}px;
  height: ${(p) => (p.active ? 8 : 6)}px;
  border-radius: 6px;
  margin: 0 4px;
  background-color: ${(p) => (p.active ? "#2aa3a3" : "#d6d6d6")};
`;

// 🔘 Icon bar
export const IconBar = styled.View`
  width: 100%;
  padding-vertical: 14px;
  background-color: #ffffff;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  border-top-width: 10px;
  border-top-color: #f4f4f4;
  padding: 12px 0;
  font-weight: 500;
`;

export const IconItem = styled.TouchableOpacity`
  align-items: center;
  justify-content: center;
`;

export const IconLabel = styled.Text`
  font-size: 12px;
  color: #2a2a2a;
  margin-top: 6px;
`;

// 🔹 Tiêu đề có gạch xanh
export const SectionHeader = styled.View`
  margin: 16px 0;
  padding-horizontal: 16px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const SectionTitle = styled.Text`
  font-weight: 500;
  font-size: 15px;
  color: #111111;
  position: relative;
  padding-left: 10px;
  border-left-width: 3px;
  border-left-color: #2aa3a3;
`;

export const SeeMore = styled.Text`
  font-size: 13px;
  color: #9b9b9b;
`;

// 📚 Khối TRUYỆN MỚI CẬP NHẬT
export const SectionBlock = styled.View`
  margin-top: 8px;
  background-color: #ffffff;
  padding-bottom: 8px;
  border-top-width: 1px;
  border-top-color: #ededed;
`;

export const RowHorizontal = styled.ScrollView`
  padding-left: 16px;
  padding-vertical: 10px;
`;

// 📗 Card nhỏ (ảnh + tiêu đề)
export const SmallCard = styled.TouchableOpacity`
  width: 95px;
  margin-right: 12px;
`;

export const SmallCover = styled.Image`
  width: 95px;
  height: 140px;
  border-radius: 4px;
  background-color: #e9e9e9;
`;

export const SmallTitle = styled.Text`
  margin-top: 6px;
  width: 95px;
  font-size: 12px;
  color: #222;
`;

// 📖 Danh sách truyện đề cử
export const ListBlock = styled.View`
  background-color: #ffffff;
  margin-top: 8px;
`;

export const ListItem = styled.TouchableOpacity`
  flex-direction: row;
  padding: 12px 16px;
  align-items: center;
  border-bottom-width: 1px;
  border-bottom-color: #f0f0f0;
`;

export const ListThumb = styled.Image`
  width: 56px;
  height: 80px;
  border-radius: 4px;
  background-color: #e9e9e9;
`;

export const ListContent = styled.View`
  flex: 1;
  margin-left: 12px;
`;

export const ListTitle = styled.Text`
  font-size: 14px;
  font-weight: 600;
  color: #111;
`;

export const ListMeta = styled.Text`
  font-size: 12px;
  color: #9b9b9b;
  margin-top: 4px;
`;
