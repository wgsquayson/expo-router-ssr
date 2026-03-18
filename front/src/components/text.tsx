import { useMemo } from "react";
import {
  Text as RNText,
  TextProps as RNTextProps,
  StyleSheet,
  TextStyle,
} from "react-native";

type TextVariant = "default" | "title" | "bold";

type TextProps = RNTextProps & {
  variant?: TextVariant;
  color?: string;
};

export default function Text({
  children,
  variant = "default",
  color,
  ...props
}: TextProps) {
  const style = useMemo<TextStyle>(
    () => ({
      ...styles[variant],
      color,
      textAlign: "center",
    }),
    [],
  );

  return (
    <RNText {...props} style={style}>
      {children}
    </RNText>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 24, color: "black", fontWeight: "bold" },
  default: { fontSize: 16, color: "black" },
  bold: { fontSize: 16, color: "black", fontWeight: "bold" },
});
