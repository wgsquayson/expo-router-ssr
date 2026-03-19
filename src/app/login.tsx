import Text from "@/components/text";
import Layout from "@/components/layout";
import Input from "@/components/input";
import Button from "@/components/button";

import Head from "expo-router/head";

export default function Login() {
  return (
    <>
      <Head>
        <title>Login | Expo Router SSR</title>
        <meta
          name="description"
          content="Login to use the Expo Router SSR app."
        />
      </Head>

      <Layout>
        <Text variant="title">Login to Expo Router SSR</Text>
        <Input placeholder="Email" />
        <Input placeholder="Password" />
        <Button text="Login" />
        <Text variant="bold">Sign up</Text>
      </Layout>
    </>
  );
}
