import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { LoginDTO } from "@/lib/auth/types";

export async function POST(request: NextRequest) {
  try {
    const body: LoginDTO = await request.json();

    if (!body.email || !body.password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    const response = await fetch(`${process.env.BACKEND_URL || "http://localhost:8080"}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    console.log("Login response from backend:", data);

    if (response.ok && data.token) {
      const cookieStore = await cookies();

      cookieStore.set("token", data.token, {
        httpOnly: true,
        path: "/",
        sameSite: "lax",
      });
    }

    return NextResponse.json(data, { status: response.status });

  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "An error occurred during login" },
      { status: 500 }
    );
  }
}
