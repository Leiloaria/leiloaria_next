import { NextRequest, NextResponse } from "next/server";
import { apiGet, apiPatch } from "@/lib/api";
import { Usuario } from "@/lib/auth/types";
import { CategoriaRequest, CategoriaResponse } from "@/lib/categories/types";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body: Partial<CategoriaRequest> = await request.json();

    if (!body.nome || body.nome.length < 3) {
      return NextResponse.json(
        { message: "Nome da subcategoria deve ter pelo menos 3 caracteres" },
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

    const response = await apiPatch<CategoriaResponse>(`/categorias/${id}/subcategorias`, {
      nome: body.nome,
      userId: meResponse.data.id,
    });

    if (!response.ok) {
      return NextResponse.json(
        { message: response.error?.message || "Erro ao adicionar subcategoria" },
        { status: response.status }
      );
    }

    return NextResponse.json(response.data);
  } catch (error) {
    return NextResponse.json({ message: "Erro ao adicionar subcategoria" }, { status: 500 });
  }
}
