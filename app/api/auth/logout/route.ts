import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

interface LogoutResponse {
  success: boolean;
  message: string;
}

export async function POST(request: NextRequest): Promise<NextResponse<LogoutResponse>> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (token) {
      try {
        await fetch(`${process.env.BACKEND_URL || "http://localhost:8080"}/api/auth/logout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (backendError) {
        console.error("Logout error from backend:", backendError);
      }
    }

    cookieStore.delete("token");

    return NextResponse.json(
      {
        success: true,
        message: "Logout realizado com sucesso",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Erro ao fazer logout",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest): Promise<NextResponse<LogoutResponse>> {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("token");

    return NextResponse.json(
      {
        success: true,
        message: "Logout realizado com sucesso",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Logout GET error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Erro ao fazer logout",
      },
      { status: 500 }
    );
  }
}
