import { FormValues } from "@/types/form-values";

export function validator(values: FormValues): { email?: string } {
  const e: Partial<Record<keyof FormValues, string | undefined>> = {};

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(values.email)) {
    e.email = "Invalid e-mail";
  }

  if (!values.email) {
    e.email = "Email is required";
  }

  if (values.password.length < 3) {
    e.password = "Password must be at least 3 characters long";
  }

  return e;
}
