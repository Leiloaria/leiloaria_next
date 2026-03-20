import { NextRequest, NextResponse } from "next/server";
import { apiPatch, apiDelete, apiGet } from "@/lib/api";
import { UpdateLeilaoRequest, LeilaoResponse } from "@/lib/auctions/types";
import { Usuario } from "@/lib/auth/types";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body: UpdateLeilaoRequest = await request.json();

    if (body.nome && body.nome.length < 3) {
      return NextResponse.json(
        { message: "Nome deve ter pelo menos 3 caracteres" },
        { status: 400 }
      );
    }

    const response = await apiPatch<LeilaoResponse>(`/leiloes/${id}`, body);

    if (!response.ok) {
      return NextResponse.json(
        { message: response.error?.message || "Erro ao atualizar leilão" },
        { status: response.status }
      );
    }

    return NextResponse.json(response.data);
  } catch (error) {
    return NextResponse.json({ message: "Erro ao atualizar leilão" }, { status: 500 });
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

    const response = await apiDelete(`/leiloes/${id}`, {
      userId: meResponse.data.id,
    });

    if (!response.ok) {
      return NextResponse.json(
        { message: response.error?.message || "Erro ao excluir leilão" },
        { status: response.status }
      );
    }

    return NextResponse.json({ message: "Leilão excluído com sucesso" });
  } catch (error) {
    return NextResponse.json({ message: "Erro ao excluir leilão" }, { status: 500 });
  }
}
