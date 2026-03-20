import { NextRequest, NextResponse } from "next/server";
import { apiPost } from "@/lib/api";
import { AvaliacaoRequest, AvaliacaoResponse, LeilaoResponse } from "@/lib/auctions/types";

export async function POST(request: NextRequest) {
  try {
    const body: AvaliacaoRequest = await request.json();

    const missingFields: string[] = [];
    if (!body.stars) missingFields.push("stars");
    if (!body.comentario) missingFields.push("Comentário");
    if (!body.loteId) missingFields.push("Id do lote");

    if (missingFields.length > 0) {
      return NextResponse.json(
        { message: `Campos obrigatórios faltando: ${missingFields.join(", ")}` },
        { status: 400 }
      );
    }

    const avaliacaoData: any = {
      comentario: body.comentario,
      stars: body.stars
    }

    const response = await apiPost<AvaliacaoResponse>(`/avaliacao/lote/${body.loteId}`, avaliacaoData);

    if (!response.ok) {
      return NextResponse.json(
        { message: response.error?.message || "Erro ao criar avaliação" },
        { status: response.status }
      );
    }

    return NextResponse.json(response.data, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar avaliação:", error);
    return NextResponse.json({ message: "Erro ao criar avaliação" }, { status: 500 });
  }
}