import {
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";
import Text from "./text";

type ButtonProps = TouchableOpacityProps & {
  text: string;
};

export default function Button({ text, ...props }: ButtonProps) {
  return (
    <TouchableOpacity {...props} style={styles.button}>
      <Text variant="bold" color="white">
        {text}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: "100%",
    backgroundColor: "green",
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
  },
});
