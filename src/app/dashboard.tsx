import Button from "@/components/button";
import Layout from "@/components/layout";
import Text from "@/components/text";
import { getTokensFromCookies, verifyToken } from "@/utils/auth";
import { router, useLoaderData } from "expo-router";
import Head from "expo-router/head";
import { LoaderFunction } from "expo-server";
import { JWTPayload } from "jose";
import { useState } from "react";

export const loader: LoaderFunction<JWTPayload | null> = async (request) => {
  const { accessToken } = getTokensFromCookies(request);

  if (!accessToken) {
    return null;
  }

  const payload = await verifyToken(accessToken);

  return payload;
};

export default function Dashboard() {
  const [error, setError] = useState<string | undefined>();

  const data = useLoaderData<typeof loader>();

  function setGenericError() {
    setError("Failed to logout, please try again");
  }

  async function handleLogout() {
    setError(undefined);

    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        router.replace("/login");
        window.location.reload();
        return;
      }

      setGenericError();
    } catch (error) {
      setGenericError();
    }
  }

  return (
    <>
      <Head>
        <title>Dashboard | Expo Router SSR</title>
        <meta name="description" content="Explore the Expo Router SSR app." />
      </Head>

      <Layout>
        <Text variant="title">Welcome to Expo Router SSR Dashboard!</Text>
        <Text>{`Your ID: ${data?.sub}\nYour E-mail: ${data?.email}`}</Text>
        <Button text="Logout" onPress={handleLogout} />
        {error ? <Text color="red">{error}</Text> : null}
      </Layout>
    </>
  );
}
