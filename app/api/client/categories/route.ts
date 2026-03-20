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
