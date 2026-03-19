import {
  generateCookieHeaders,
  generateToken,
  verifyToken,
} from "@/utils/auth";
import { db } from "@/utils/db";
import { StatusError } from "expo-server";

export async function POST(request: Request): Promise<Response> {
  const cookieHeader = request.headers.get("cookie") || "";

  const refreshToken = cookieHeader
    .split("; ")
    .find((row) => row.startsWith("refreshToken="))
    ?.split("=")[1];

  if (!refreshToken) {
    throw new StatusError(401, { message: "Unauthorized" });
  }

  const payload = await verifyToken(refreshToken);

  if (!payload || !payload.sub || payload.type !== "refresh") {
    throw new StatusError(401, { message: "Invalid or expired token" });
  }

  const user = db.getUser(payload.sub);

  if (!user) {
    throw new StatusError(401, { message: "User not found" });
  }

  if (user.refreshToken !== refreshToken) {
    throw new StatusError(401, { message: "Invalid refresh token" });
  }

  const newAccessToken = await generateToken(
    {
      id: user.id,
      email: user.email,
    },
    "access",
    "15m",
  );

  const newRefreshToken = await generateToken(
    {
      id: user.id,
      email: user.email,
    },
    "refresh",
    "7d",
  );

  db.updateUser(user.id, {
    refreshToken: newRefreshToken,
  });

  return Response.json(
    {},
    {
      status: 200,
      headers: generateCookieHeaders(newAccessToken, newRefreshToken),
    },
  );
}
