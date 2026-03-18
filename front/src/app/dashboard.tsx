import Button from "@/components/button";
import Layout from "@/components/layout";
import Text from "@/components/text";

export default function Dashboard() {
  return (
    <Layout>
      <Text variant="title">
        Welcome to Expo Router SSR Dashboard, William!
      </Text>
      <Button text="Logout" />
    </Layout>
  );
}
