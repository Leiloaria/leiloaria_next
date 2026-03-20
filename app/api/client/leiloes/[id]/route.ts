import { NextRequest, NextResponse } from "next/server";
import { apiGet, apiPatch, apiDelete } from "@/lib/api";
import { LeilaoResponse, UpdateLeilaoRequest } from "@/lib/auctions/types";
import { Usuario } from "@/lib/auth";
import { CancelarLeilaoRequest } from "@/lib/auctions/types"; 

type RouteContext = {
  params: Promise<{ id: string }>;
};

const recoverAuthUser = async (): Promise<Usuario | null> => {
  try {
    const meResponse = await apiGet<Usuario>(`/users/me`);
    if (!meResponse.ok || !meResponse.data?.id) {
      console.log("[client/leiloes][PATCH] Falha ao resolver usuário via /users/me:", meResponse.error);
      return null;
    }
    return meResponse.data;
  } catch (e) {
    console.error("Erro ao recuperar usuário autenticado:", e);
    return null;
  }
};

export async function GET(
  _request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { message: "ID do leilão é obrigatório" },
        { status: 400 }
      );
    }

    const response = await apiGet<LeilaoResponse>(`/leiloes/${id}`);

    if (!response.ok) {
      return NextResponse.json(
        { message: response.error?.message || "Erro ao buscar leilão" },
        { status: response.status || 500 }
      );
    }

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Erro ao buscar leilão específico:", error);

    return NextResponse.json(
      { message: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  _request: NextRequest,
  { params }: RouteContext) {
  try {

    const { id } = await params;
    const body: any = await _request.json();

    const missingFields: string[] = [];
    if (!body.nome) missingFields.push("nome");
    if (!body.inicio) missingFields.push("inicio");
    if (!body.fim) missingFields.push("fim");
    if (!body.prazoPagamento) missingFields.push("prazoPagamento");
    if (body.lanceMinimo === undefined || body.lanceMinimo === null || body.lanceMinimo === "") missingFields.push("lanceMinimo");

    if (missingFields.length > 0) {
      return NextResponse.json(
        { message: `Campos obrigatórios faltando: ${missingFields.join(", ")}` },
        { status: 400 }
      );
    }

    if (!body.itens || body.itens.length === 0) {
      return NextResponse.json(
        { message: "Leilão deve ter pelo menos um item" },
        { status: 400 }
      );
    }

    for (const item of body.itens) {
      if (!item.nome || item.nome.length < 3) {
        return NextResponse.json(
          { message: "Cada item deve ter nome com pelo menos 3 caracteres" },
          { status: 400 }
        );
      }
      if (!item.condicao) {
        return NextResponse.json(
          { message: "Cada item deve ter condição definida" },
          { status: 400 }
        );
      }
      if (!item.categoriasId || item.categoriasId.length === 0) {
        return NextResponse.json(
          { message: "Cada item deve ter pelo menos uma categoria" },
          { status: 400 }
        );
      }
    }

    const leilaoData: UpdateLeilaoRequest = {
      ...body,
      lanceMinimo: typeof body.lanceMinimo === "string"
        ? parseFloat(body.lanceMinimo)
        : body.lanceMinimo,
    };

    const response = await apiPatch<LeilaoResponse>(`/leiloes/${id}`, leilaoData);

    if (!response.ok) {
      return NextResponse.json(
        { message: response.error?.message || "Erro ao atualizar leilão" },
        { status: response.status }
      );
    }

    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    console.error("Erro ao atualizar leilão:", error);
    return NextResponse.json({ message: "Erro ao atualizar leilão" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: RouteContext) {
  try {

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { message: "ID do leilão é obrigatório" },
        { status: 400 }
      );
    }

    const authUser = await recoverAuthUser();
    if (!authUser) {
      return NextResponse.json(
        { message: "Usuário não autenticado" },
        { status: 401 }
      );
    }

    const idUsuario = authUser.id;

    
    const cancelamento: CancelarLeilaoRequest = {
      userId: idUsuario
    };

    const response = await apiDelete<LeilaoResponse>(`/leiloes/${id}`, cancelamento);

    if (!response.ok) {
      console.error("Erro ao cancelar leilão:", response.error);
      return NextResponse.json(
        { message: response.error?.message || "Erro ao cancelar leilão" },
        { status: response.status }
      );
    } else {
      console.log("Leilão cancelado com sucesso:", response.data);
    }

    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    console.error("Erro ao cancelar leilão:", error);
    return NextResponse.json({ message: "Erro ao cancelar leilão" }, { status: 500 });
  }
}

