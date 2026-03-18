import Text from "@/components/text";
import Layout from "@/components/layout";
import Input from "@/components/input";
import Button from "@/components/button";

export default function SignUp() {
  return (
    <Layout>
      <Text variant="title">Sign Up to Expo Router SSR</Text>
      <Input placeholder="Name" />
      <Input placeholder="Email" />
      <Input placeholder="Password" />
      <Button text="Login" />
    </Layout>
  );
}
