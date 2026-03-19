import {
  getTokensFromCookies,
  invalidateCookies,
  isTokenExpired,
} from "@/utils/auth";

const PROTECTED_PATHS = ["/dashboard"];
const PUBLIC_PATHS = ["/", "/login", "/signup"];

export default async function middleware(request: Request) {
  const url = new URL(request.url);
  const { pathname } = url;

  const isApiRoute = pathname.startsWith("/auth");

  // Skips api routes
  if (isApiRoute) {
    return;
  }

  console.log(`[MIDDLEWARE] [${request.method}] ${pathname}`);

  const { accessToken, refreshToken } = getTokensFromCookies(request);

  const isProtected = PROTECTED_PATHS.includes(pathname);

  // Redirects to login if the route is protected but there is no refresh token
  if (isProtected && !refreshToken) {
    return Response.redirect(new URL("/login", request.url));
  }

  // If there is a valid access token
  if (accessToken && !isTokenExpired(accessToken)) {
    // Redirects to dashboard if the user is in an public path
    if (PUBLIC_PATHS.includes(pathname)) {
      return Response.redirect(new URL("/dashboard", request.url));
    }

    // Does nothing if the user is already on the dashboard
    return;
  }

  // Attempts to refresh the access token if it's invalid
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

      // Invalidates cookies and redirects to login if refreshing the token fails
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

  // Sends user to login on accessing "/"
  if (pathname === "/") {
    return Response.redirect(new URL("/login", request.url));
  }

  return;
}
