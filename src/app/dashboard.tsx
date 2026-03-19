import Button from "@/components/button";
import Layout from "@/components/layout";
import Text from "@/components/text";

import Head from "expo-router/head";

export default function Dashboard() {
  return (
    <>
      <Head>
        <title>Dashboard | Expo Router SSR</title>
        <meta name="description" content="Explore the Expo Router SSR app." />
      </Head>

      <Layout>
        <Text variant="title">
          Welcome to Expo Router SSR Dashboard, William!
        </Text>
        <Button text="Logout" />
      </Layout>
    </>
  );
}
