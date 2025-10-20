import React from "react";
import { View, ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

interface GradientViewProps {
  colors: string[];
  style?: ViewStyle;
  children?: React.ReactNode;
}

const GradientView: React.FC<GradientViewProps> = ({
  colors,
  style,
  children,
}) => {
  return (
    <LinearGradient colors={colors as any} style={[{ flex: 1 }, style]}>
      {children}
    </LinearGradient>
  );
};

export default GradientView;
