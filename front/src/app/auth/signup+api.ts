import { User } from "@/types/user";
import { generateAccessToken, generateRefreshToken } from "@/utils/auth";
import { db } from "@/utils/db";
import { StatusError } from "expo-server";

type SignUpResponse = {
  accessToken: string;
  user: {
    email: string;
    name: string;
  };
};

export async function POST(request: Request): Promise<Response> {
  const { name, email, password } = await request.json();
  const users = db.getUsers();

  if (!(name && email && password)) {
    throw new StatusError(400, { message: "Missing required fields" });
  }

  if (users.find((u: User) => u.email === email)) {
    throw new StatusError(400, { message: "User already exists" });
  }

  const newUser: User = {
    id: Date.now().toString(),
    name,
    email,
    password,
  };

  db.saveUser(newUser);

  const accessToken = await generateAccessToken(newUser);
  const refreshToken = await generateRefreshToken(newUser);

  const responseBody: SignUpResponse = {
    accessToken,
    user: {
      name: newUser.name,
      email: newUser.email,
    },
  };

  return Response.json(responseBody, {
    status: 201,
    headers: {
      "Set-Cookie": `refreshToken=${refreshToken}; HttpOnly; Path=/; Max-Age=604800; SameSite=Strict; Secure`,
    },
  });
}
