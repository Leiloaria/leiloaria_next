import { NextRequest, NextResponse } from "next/server";
import { getPostAuthRedirectPath, isAdminByScope } from "@/lib/auth/access";
import { decodeJwtPayload } from "@/lib/auth/jwt";

export function proxy(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const pathname = request.nextUrl.pathname;

  const payload = token
    ? decodeJwtPayload<{
        sub?: string;
        email?: string;
        scope?: string;
      }>(token)
    : null;

  if (token && pathname === "/") {
    const redirectPath = getPostAuthRedirectPath({
      scope: payload?.scope,
    });
    return NextResponse.redirect(new URL(redirectPath, request.url));
  }

  if (pathname.startsWith("/admin")) {
    if (!token || !isAdminByScope(payload?.scope)) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
  }

  if (pathname.startsWith("/client") || pathname.startsWith("/api/client")) {
    if (!token) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
  }

  if (pathname.startsWith("/api/admin")) {
    if (!token || !isAdminByScope(payload?.scope)) {
      return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
   matcher: ["/", "/admin/:path*", "/client/:path*", "/api/:path*"],
};
