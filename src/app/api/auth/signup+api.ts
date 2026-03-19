import { User } from "@/types/user";
import { generateCookieHeaders, generateToken } from "@/utils/auth";
import { db } from "@/utils/db";
import { StatusError } from "expo-server";

export async function POST(request: Request): Promise<Response> {
  const { email, password } = await request.json();
  const users = db.getUsers();

  if (!(email && password)) {
    throw new StatusError(400, { message: "Missing required fields" });
  }

  if (users.find((u: User) => u.email === email)) {
    throw new StatusError(400, { message: "User already exists" });
  }

  const newUser: User = {
    id: Date.now().toString(),
    email,
    password,
  };

  const accessToken = await generateToken(
    {
      id: newUser.id,
      email: newUser.email,
    },
    "access",
    "15m",
  );

  const refreshToken = await generateToken(
    {
      id: newUser.id,
      email: newUser.email,
    },
    "refresh",
    "7d",
  );

  db.saveUser({
    ...newUser,
    refreshToken,
  });

  return Response.json(null, {
    status: 201,
    headers: generateCookieHeaders(accessToken, refreshToken),
  });
}
