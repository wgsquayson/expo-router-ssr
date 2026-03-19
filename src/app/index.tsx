import { Text, View } from "react-native";
import { useLoaderData } from "expo-router";

export async function loader() {
  const data = { message: "Hello from server!" };
  return data;
}

export default function HomeScreen() {
  const data = useLoaderData<typeof loader>();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{ color: "black" }}>SSR: {data.message}</Text>
    </View>
  );
}
