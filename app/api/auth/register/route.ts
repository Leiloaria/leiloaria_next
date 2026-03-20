import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { RegisterFormDTO, RegisterDTO } from "@/lib/auth/types";

export async function POST(request: NextRequest) {
  try {
    const body: RegisterFormDTO = await request.json();

    if (!body.username || !body.email || !body.password || !body.passwordConfirm) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    if (body.password !== body.passwordConfirm) {
      return NextResponse.json(
        { message: "Passwords do not match" },
        { status: 400 }
      );
    }

    if (body.password.length < 8) {
      return NextResponse.json(
        { message: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    const payload: RegisterDTO = {
      username: body.username,
      email: body.email,
      password: body.password,
    };

    const response = await fetch(`${process.env.BACKEND_URL || "http://localhost:8080"}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

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
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "An error occurred during registration" },
      { status: 500 }
    );
  }
}
