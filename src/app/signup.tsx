import Button from "@/components/button";
import Input from "@/components/input";
import Layout from "@/components/layout";
import Text from "@/components/text";

import Head from "expo-router/head";

export default function SignUp() {
  return (
    <>
      <Head>
        <title>Sign up | Expo Router SSR</title>
        <meta
          name="description"
          content="Create an account to use the Expo Router SSR app."
        />
      </Head>

      <Layout>
        <Text variant="title">Sign Up to Expo Router SSR</Text>
        <Input placeholder="Email" />
        <Input placeholder="Password" />
        <Button text="Sign up" />
        <Text variant="bold">Go back</Text>
      </Layout>
    </>
  );
}
