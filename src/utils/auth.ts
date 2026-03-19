import { environment, ImmutableRequest } from "expo-server";
import { jwtVerify, SignJWT } from "jose";

type TokenData = { id: string; email: string };

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function generateToken(
  { id, email }: TokenData,
  type: "access" | "refresh",
  expiration: string,
) {
  return await new SignJWT({ sub: id, email, type })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiration)
    .sign(SECRET);
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload;
  } catch {
    return null;
  }
}

export function generateCookieHeaders(
  accessToken: string,
  refreshToken: string,
) {
  const env = environment();
  const isProd = env === "production";

  const headers = new Headers();

  const baseOptions = [
    "HttpOnly",
    "Path=/",
    "SameSite=Strict",
    isProd ? "Secure" : "",
  ]
    .filter(Boolean)
    .join("; ");

  headers.append(
    "Set-Cookie",
    `accessToken=${accessToken}; Max-Age=900; ${baseOptions}`,
  );

  headers.append(
    "Set-Cookie",
    `refreshToken=${refreshToken}; Max-Age=604800; ${baseOptions}`,
  );

  return headers;
}

export function isTokenExpired(token: string) {
  try {
    const payload = JSON.parse(
      Buffer.from(token.split(".")[1], "base64").toString(),
    );

    const now = Math.floor(Date.now() / 1000);

    return payload.exp < now;
  } catch {
    return true;
  }
}

export function getTokensFromCookies(request?: Request | ImmutableRequest) {
  const cookies = request?.headers.get("cookie") || "";

  const accessToken = cookies
    .split("; ")
    .find((c) => c.startsWith("accessToken="))
    ?.split("=")[1];

  const refreshToken = cookies
    .split("; ")
    .find((c) => c.startsWith("refreshToken="))
    ?.split("=")[1];

  return {
    accessToken,
    refreshToken,
  };
}
