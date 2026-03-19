import { getTokensFromCookies } from "@/utils/auth";
import { Redirect, useLoaderData } from "expo-router";
import { LoaderFunction } from "expo-server";

type LoaderReturn = { redirect: "/login" | "/dashboard" };

export const loader: LoaderFunction<LoaderReturn> = async (request) => {
  const { accessToken, refreshToken } = getTokensFromCookies(request);

  if (accessToken && refreshToken) {
    return { redirect: "/dashboard" };
  }

  return { redirect: "/login" };
};

export default function HomeScreen() {
  const { redirect } = useLoaderData<typeof loader>();

  if (!redirect) return null;

  return <Redirect href={redirect} />;
}
