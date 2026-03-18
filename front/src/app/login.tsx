import Text from "@/components/text";
import Layout from "@/components/layout";
import Input from "@/components/input";
import Button from "@/components/button";

export default function Login() {
  return (
    <Layout>
      <Text variant="title">Login to Expo Router SSR</Text>
      <Input placeholder="Email" />
      <Input placeholder="Password" />
      <Button text="Login" />
    </Layout>
  );
}
