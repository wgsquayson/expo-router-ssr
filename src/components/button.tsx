import {
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
  ViewStyle,
} from "react-native";
import Text from "./text";

type ButtonProps = TouchableOpacityProps & {
  text: string;
};

export default function Button({ text, ...props }: ButtonProps) {
  const style: ViewStyle = {
    ...styles.button,
    opacity: props.disabled ? 0.6 : 1,
  };

  return (
    <TouchableOpacity {...props} style={style}>
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
