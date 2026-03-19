import Button from "@/components/button";
import Input from "@/components/input";
import Layout from "@/components/layout";
import Text from "@/components/text";
import { useFormState } from "@/hooks/use-form-state";
import { FormValues } from "@/types/form-values";
import { validator } from "@/utils/form-validator";
import { router } from "expo-router";
import Head from "expo-router/head";
import { useState } from "react";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [requestError, setRequestError] = useState<string | undefined>();

  const {
    errors,
    values,
    setField,
    runValidation,
    isValid,
    touchField,
    touched,
  } = useFormState<FormValues>(
    {
      email: "",
      password: "",
    },
    validator,
    ["email", "password"],
  );

  function handleSignUp() {
    router.navigate("/signup");
  }

  async function handleSubmit() {
    runValidation();

    if (!isValid) return;

    setLoading(true);
    setRequestError(undefined);

    try {
      const data = {
        email: values.email,
        password: values.password,
      };

      const response = await fetch("/auth/login", {
        method: "POST",
        body: JSON.stringify(data),
      });

      let json = null;

      try {
        json = await response.json();
      } catch {}

      if (!response.ok) {
        throw new Error(
          json?.message ??
            "An error happened while trying to login. Try again.",
        );
      }

      router.replace("/dashboard");
    } catch (error) {
      if (error instanceof Error) {
        setRequestError(error.message);
        return;
      }

      setRequestError("An error happened while trying to login. Try again.");
    } finally {
      setLoading(false);
    }
  }

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
        <Input
          placeholder="Email"
          value={values.email}
          onChangeText={(value) => setField("email", value)}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="off"
          error={touched.email ? errors.email : undefined}
          autoCorrect={false}
          onBlur={() => touchField("email")}
        />
        <Input
          placeholder="Password"
          maxLength={10}
          value={values.password}
          onChangeText={(value) => setField("password", value)}
          secureTextEntry
          autoCapitalize="none"
          autoComplete="off"
          error={touched.password ? errors.password : ""}
          autoCorrect={false}
          onBlur={() => touchField("password")}
        />
        {requestError ? <Text color="red">{requestError}</Text> : null}
        <Button
          text="Login"
          disabled={!isValid || loading}
          onPress={handleSubmit}
        />
        <Text variant="bold" cursor="pointer" onPress={handleSignUp}>
          Sign up
        </Text>
      </Layout>
    </>
  );
}
