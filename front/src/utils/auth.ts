import { SignJWT, jwtVerify } from "jose";

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
