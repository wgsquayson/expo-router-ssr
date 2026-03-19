import { invalidateCookies, verifyToken } from "@/utils/auth";
import { db } from "@/utils/db";

export async function POST(request: Request): Promise<Response> {
  const cookieHeader = request.headers.get("cookie") || "";

  const refreshToken = cookieHeader
    .split("; ")
    .find((row) => row.startsWith("refreshToken="))
    ?.split("=")[1];

  if (!refreshToken) {
    return new Response(null, {
      status: 204,
    });
  }

  const payload = await verifyToken(refreshToken);

  if (!payload || !payload.sub) {
    return new Response(null, {
      status: 204,
    });
  }

  const user = db.getUser(payload.sub);

  if (user && user.refreshToken === refreshToken) {
    db.updateUser(user.id, {
      refreshToken: null,
    });
  }

  return new Response(null, {
    status: 204,
    headers: invalidateCookies(),
  });
}
