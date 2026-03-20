import { NextRequest, NextResponse } from "next/server";
import { apiGet } from "@/lib/api";
import { AvaliacaoResponse } from "@/lib/auctions/types";

type RouteContext = {
  params: Promise<{ id: number }>;
};

interface AvaliacaoPageResponse {
  content: AvaliacaoResponse[];
}

export async function GET(
  _request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { message: "ID do lote é obrigatório" },
        { status: 400 }
      );
    }

    const response = await apiGet<AvaliacaoPageResponse>(`/avaliacao/lote/${id}`);

    if (!response.ok) {
      return NextResponse.json({ message: "Erro ao avaliações leilões" }, { status: response.status });
    }

    const data = response.data as AvaliacaoPageResponse | AvaliacaoResponse[];
    const revies = Array.isArray((data as any)?.content)
      ? (data as any).content
      : Array.isArray(data)
        ? data
        : [];

    return NextResponse.json(revies);
  } catch (error) {
    return NextResponse.json({ message: "Erro ao buscar avaliações" }, { status: 500 });
  }
}