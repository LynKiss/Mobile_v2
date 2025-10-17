// src/styles/theme.ts
export const theme = {
  colors: {
    primary: "#007AFF", // xanh iOS
    secondary: "#5E5CE6", // tím nhẹ iOS
    background: "#F9F9F9", // nền sáng
    surface: "#FFFFFF", // màu khối / thẻ
    text: "#1C1C1E", // chữ chính
    textSecondary: "#8E8E93", // chữ phụ
    border: "#E5E5EA", // viền nhạt
    danger: "#FF3B30", // đỏ cảnh báo
    success: "#34C759", // xanh xác nhận
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
  },
  borderRadius: {
    sm: 6,
    md: 10,
    lg: 14,
    xl: 20,
  },
  font: {
    regular: "System",
    medium: "System",
    bold: "System",
  },
  shadows: {
    light: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.06,
      shadowRadius: 2,
      elevation: 1,
    },
    medium: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 2,
    },
  },
};
