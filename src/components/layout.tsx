import { PropsWithChildren } from "react";
import { StyleSheet, View } from "react-native";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <View style={[styles.container, { height: window.innerHeight }]}>
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "sans-serif",
  },
  content: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: 400,
    padding: 24,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    gap: 12,
  },
});
