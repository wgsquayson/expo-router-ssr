import {
  getTokensFromCookies,
  invalidateCookies,
  isTokenExpired,
} from "@/utils/auth";

const PROTECTED_PATHS = ["/dashboard"];

export default async function middleware(request: Request) {
  const url = new URL(request.url);
  const { pathname } = url;

  const isApiRoute = pathname.startsWith("/auth");

  if (isApiRoute) {
    return;
  }

  console.log(`[MIDDLEWARE] [${request.method}] ${pathname}`);

  const { accessToken, refreshToken } = getTokensFromCookies(request);

  const isProtected = PROTECTED_PATHS.includes(pathname);

  if (isProtected && !refreshToken) {
    return Response.redirect(new URL("/login", request.url));
  }

  if (accessToken && !isTokenExpired(accessToken)) {
    return;
  }

  if (refreshToken) {
    console.log(`[MIDDLEWARE] Invalid access token, refreshing...`);

    try {
      const refreshRes = await fetch(new URL("/auth/refresh", request.url), {
        method: "POST",
        headers: {
          cookie: `refreshToken=${refreshToken}`,
        },
      });

      if (refreshRes.ok) {
        const cookies = refreshRes.headers.getSetCookie();

        if (cookies.length > 0) {
          const headers = new Headers();

          cookies.forEach((cookie) => {
            headers.append("Set-Cookie", cookie);
          });

          return new Response(null, {
            status: 204,
            headers,
          });
        }
      }

      console.log("[MIDDLEWARE] Refresh failed, invalidating cookies.");

      const headers = new Headers({
        Location: "/login",
      });

      const cookieHeaders = invalidateCookies();

      cookieHeaders.forEach((value, key) => {
        headers.append(key, value);
      });

      return new Response(null, {
        status: 302,
        headers,
      });
    } catch (e) {
      console.log("[MIDDLEWARE] Refresh error.");
    }
  }

  if (isProtected) {
    return Response.redirect(new URL("/login", request.url));
  }

  return;
}
