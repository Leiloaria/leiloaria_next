import { NextRequest, NextResponse } from "next/server";
import { apiGet, apiPost } from "@/lib/api";
import { LeilaoRequest, LeilaoResponse } from "@/lib/auctions/types";

interface LeilaoPageResponse {
  content: LeilaoResponse[];
}

export async function GET(request: NextRequest) {
  try {
    const response = await apiGet<LeilaoPageResponse>(`/leiloes`);

    if (!response.ok) {
      return NextResponse.json({ message: "Erro ao buscar leilões" }, { status: response.status });
    }

    const data = response.data as LeilaoPageResponse | LeilaoResponse[];
    const auctions = Array.isArray((data as any)?.content)
      ? (data as any).content
      : Array.isArray(data)
        ? data
        : [];

    return NextResponse.json({ auctions });
  } catch (error) {
    return NextResponse.json({ message: "Erro ao buscar leilões" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: LeilaoRequest = await request.json();

    if (!body.nome || !body.inicio || !body.fim || !body.prazoPagamento || body.lanceMinimo === undefined || !body.idUsuario) {
      return NextResponse.json(
        { message: "Campos obrigatórios faltando" },
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

    const response = await apiPost<LeilaoResponse>(`/leiloes`, body);

    if (!response.ok) {
      return NextResponse.json(
        { message: response.error?.message || "Erro ao criar leilão" },
        { status: response.status }
      );
    }

    return NextResponse.json(response.data, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Erro ao criar leilão" }, { status: 500 });
  }
}
