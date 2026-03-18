import { User } from "@/types/user";
import { generateToken } from "@/utils/auth";
import { db } from "@/utils/db";
import { StatusError } from "expo-server";

type LoginResponse = {
  accessToken: string;
  user: {
    email: string;
    id: string;
  };
};

export async function POST(request: Request): Promise<Response> {
  const { email, password } = await request.json();
  const users = db.getUsers();

  if (!(email && password)) {
    throw new StatusError(400, { message: "Missing required fields" });
  }

  const user = users.find(
    (u: User) => u.email === email && u.password === password,
  );

  if (!user) {
    throw new StatusError(400, { message: "Email or password is incorrect" });
  }

  const accessToken = await generateToken(
    {
      id: user.id,
      email: user.email,
    },
    "access",
    "15m",
  );

  const refreshToken = await generateToken(
    {
      id: user.id,
      email: user.email,
    },
    "refresh",
    "7d",
  );

  db.updateUser(user.id, {
    refreshToken,
  });

  const responseBody: LoginResponse = {
    accessToken,
    user: {
      id: user.id,
      email: user.email,
    },
  };

  return Response.json(responseBody, {
    status: 201,
    headers: {
      "Set-Cookie": `refreshToken=${refreshToken}; HttpOnly; Path=/; Max-Age=604800; SameSite=Strict; Secure`,
    },
  });
}
