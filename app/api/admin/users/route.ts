import { NextRequest, NextResponse } from "next/server";
import { apiGet } from "@/lib/api";
import { Usuario } from "@/lib/auth/types";

interface UserPageResponse {
  content: Usuario[];
}

export async function GET(request: NextRequest) {
  try {
    const response = await apiGet<UserPageResponse>(`/users`);

    if (!response.ok) {
      return NextResponse.json(
        { message: "Erro ao buscar usuários" },
        { status: response.status }
      );
    }

    const data = response.data as UserPageResponse | Usuario[];
    const users = Array.isArray((data as any)?.content)
      ? (data as any).content
      : Array.isArray(data)
        ? data
        : [];

    return NextResponse.json({ users });
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
    return NextResponse.json(
      { message: "Erro ao buscar usuários" },
      { status: 500 }
    );
  }
}


