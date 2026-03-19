import { StyleSheet, TextInput, TextInputProps, View } from "react-native";
import Text from "./text";

type InputProps = TextInputProps & {
  error?: string;
};

export default function Input({ error, ...props }: InputProps) {
  return (
    <View style={styles.container}>
      <TextInput {...props} style={styles.input} />
      {error ? (
        <Text color="red" textAlign="left">
          {error}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    gap: 4,
    flexDirection: "column",
    textAlign: "left",
  },
  input: {
    width: "100%",
    padding: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
  },
});
