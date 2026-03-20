import { NextRequest, NextResponse } from "next/server";
import { apiDelete, apiPatch, apiPut } from "@/lib/api";
import { error } from "console";
import { AvaliacaoRequest, AvaliacaoResponse } from "@/lib/auctions/types";

type RouteContext = {
  params: Promise<{ id: number }>;
};

export async function DELETE(
  _request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { message: "ID da avaliação é obrigatório" },
        { status: 400 }
      );
    }

    const response = await apiDelete<void>(`/avaliacao/${id}`);

    if (!response.ok) {
      const errorMessage = (response.error as { message?: string })?.message;

      if (errorMessage) {
        return NextResponse.json({ message: errorMessage }, { status: response.status });
      }

      return NextResponse.json({ message: "Erro ao excluir avaliação" }, { status: response.status });
    }


    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json({ message: "Erro ao excluir avaliação" }, { status: 500 });
  }
}

export async function PATCH(
  _request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { message: "ID da avaliação é obrigatório" },
        { status: 400 }
      );
    }
    const body: AvaliacaoRequest = await _request.json();

    const missingFields: string[] = [];
    if (!body.stars) missingFields.push("stars");
    if (!body.comentario) missingFields.push("Comentário");

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

    const response = await apiPut<AvaliacaoResponse>(`/avaliacao/${id}`, avaliacaoData);

    if (!response.ok) {
      const errorMessage = (response.error as { message?: string })?.message;

      if (errorMessage) {
        return NextResponse.json({ message: errorMessage }, { status: response.status });
      }

      return NextResponse.json({ message: "Erro ao atualizar avaliação" }, { status: response.status });
    }
    return NextResponse.json(response.data, { status: 200 });

  } catch (error) {
    console.error("Erro ao atualizar avaliação:", error);
    return NextResponse.json({ message: "Erro ao atualizar avaliação" }, { status: 500 });
  }
}