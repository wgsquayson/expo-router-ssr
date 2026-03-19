import { getTokensFromCookies, isTokenExpired } from "@/utils/auth";

const PROTECTED_PATHS = ["/dashboard"];

export default async function middleware(request: Request) {
  const url = new URL(request.url);
  const { pathname } = url;

  if (pathname.startsWith("/auth") || pathname === "/login") {
    return;
  }

  const { accessToken, refreshToken } = getTokensFromCookies(request);

  const isProtected = PROTECTED_PATHS.includes(pathname);

  console.log(`[${request.method}] ${pathname} | protected=${isProtected}`);

  if (isProtected && !refreshToken) {
    return Response.redirect(new URL("/login", request.url));
  }

  if (accessToken && !isTokenExpired(accessToken)) {
    return;
  }

  if (refreshToken) {
    try {
      const refreshRes = await fetch(new URL("/auth/refresh", request.url), {
        method: "POST",
        headers: {
          cookie: `refreshToken=${refreshToken}`,
        },
      });

      if (refreshRes.ok) {
        const newCookies = refreshRes.headers.get("Set-Cookie");

        console.log("[Auth] refresh success");

        if (newCookies) {
          return new Response(null, {
            status: 204,
            headers: {
              "Set-Cookie": newCookies,
            },
          });
        }

        return;
      }

      console.log("[Auth] refresh failed");
    } catch (e) {
      console.log("[Auth] refresh error");
    }
  }

  if (isProtected) {
    return Response.redirect(new URL("/login", request.url));
  }

  return;
}
