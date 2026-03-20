import { NextRequest, NextResponse } from "next/server";
import { apiGet, apiPost } from "@/lib/api";
import { Usuario } from "@/lib/auth/types";
import { CategoriaRequest, CategoriaResponse } from "@/lib/categories/types";

interface CategoriaPageResponse {
  content: CategoriaResponse[];
}

export async function GET(request: NextRequest) {
  try {
    const response = await apiGet<CategoriaPageResponse>(`/categorias`);

    if (!response.ok) {
      return NextResponse.json({ message: "Erro ao buscar categorias" }, { status: response.status });
    }

    const data = response.data as CategoriaPageResponse | CategoriaResponse[];
    const categories = Array.isArray((data as any)?.content) 
      ? (data as any).content 
      : Array.isArray(data) 
        ? data 
        : [];

    return NextResponse.json({ categories });
  } catch (error) {
    return NextResponse.json({ message: "Erro ao buscar categorias" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CategoriaRequest = await request.json();

    if (!body.nome || body.nome.length < 3) {
      return NextResponse.json(
        { message: "Nome deve ter pelo menos 3 caracteres" },
        { status: 400 }
      );
    }

    const meResponse = await apiGet<Usuario>(`/users/me`);
    if (!meResponse.ok || !meResponse.data?.id) {
      return NextResponse.json(
        { message: "Usuário não autenticado" },
        { status: meResponse.status || 401 }
      );
    }

    const response = await apiPost<CategoriaResponse>(`/categorias`, {
      ...body,
      userId: meResponse.data.id,
    });

    if (!response.ok) {
      return NextResponse.json(
        { message: response.error?.message || "Erro ao criar categoria" },
        { status: response.status }
      );
    }

    return NextResponse.json(response.data, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Erro ao criar categoria" }, { status: 500 });
  }
}
