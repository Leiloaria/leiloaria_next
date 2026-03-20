import { NextRequest, NextResponse } from "next/server";
import { apiPatch, apiDelete, apiGet } from "@/lib/api";
import { Usuario } from "@/lib/auth/types";
import { CategoriaRequest, CategoriaResponse } from "@/lib/categories/types";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body: Partial<CategoriaRequest> = await request.json();

    if (body.nome && body.nome.length < 3) {
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

    const response = await apiPatch<CategoriaResponse>(`/categorias/${id}`, {
      ...body,
      userId: meResponse.data.id,
    });

    if (!response.ok) {
      return NextResponse.json(
        { message: response.error?.message || "Erro ao atualizar categoria" },
        { status: response.status }
      );
    }

    return NextResponse.json(response.data);
  } catch (error) {
    return NextResponse.json({ message: "Erro ao atualizar categoria" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const meResponse = await apiGet<Usuario>(`/users/me`);
    if (!meResponse.ok || !meResponse.data?.id) {
      return NextResponse.json(
        { message: "Usuário não autenticado" },
        { status: meResponse.status || 401 }
      );
    }

    const response = await apiDelete(`/categorias/${id}`, {
      userId: meResponse.data.id,
    });

    if (!response.ok) {
      return NextResponse.json(
        { message: response.error?.message || "Erro ao excluir categoria" },
        { status: response.status }
      );
    }

    return NextResponse.json({ message: "Categoria excluída com sucesso" });
  } catch (error) {
    return NextResponse.json({ message: "Erro ao excluir categoria" }, { status: 500 });
  }
}
