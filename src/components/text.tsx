import {
  CursorValue,
  Text as RNText,
  TextProps as RNTextProps,
  StyleSheet,
  TextStyle,
} from "react-native";

type TextVariant = "default" | "title" | "bold";

type TextProps = RNTextProps & {
  variant?: TextVariant;
  color?: string;
  cursor?: CursorValue;
  textAlign?: TextStyle["textAlign"];
};

export default function Text({
  children,
  variant = "default",
  color,
  cursor = "auto",
  textAlign = "center",
  ...props
}: TextProps) {
  const style: TextStyle = {
    ...styles[variant],
    color,
    textAlign,
    cursor,
  };

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
