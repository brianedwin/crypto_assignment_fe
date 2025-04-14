import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const role = req.cookies.get("role")?.value;

  // Jika user tidak memiliki token, redirect ke halaman login
  if (!token) {
    if (req.nextUrl.pathname !== "/auth/customer-login") {
      return NextResponse.redirect(new URL("/auth/customer-login", req.url));
    }
    return NextResponse.next();
  }

  // Jika pengguna sudah login dan mencoba mengakses "/", arahkan langsung ke dashboard yang sesuai
  if (req.nextUrl.pathname === "/") {
    if (role === "customer") {
      return NextResponse.redirect(new URL("/dashboard/customer", req.url));
    } else if (role === "employee") {
      return NextResponse.redirect(new URL("/dashboard/employee", req.url));
    } else if (role === "admin") {
      return NextResponse.redirect(new URL("/dashboard/admin", req.url));
    }
  }

  // Proteksi agar user hanya bisa masuk ke dashboard sesuai rolenya
  if (req.nextUrl.pathname.startsWith("/dashboard/customer") && role !== "customer") {
    return NextResponse.redirect(new URL("/auth/customer-login", req.url));
  }
  if (req.nextUrl.pathname.startsWith("/dashboard/employee") && role !== "employee") {
    return NextResponse.redirect(new URL("/auth/customer-login", req.url));
  }
  if (req.nextUrl.pathname.startsWith("/dashboard/admin") && role !== "admin") {
    return NextResponse.redirect(new URL("/auth/customer-login", req.url));
  }

  return NextResponse.next();
}

// Proteksi semua halaman dashboard
export const config = {
  matcher: ["/", "/dashboard/:path*"], 
};

