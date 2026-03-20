import { NextRequest, NextResponse } from "next/server";
import { apiGet, apiPost } from "@/lib/api";
import { LanceResponse, LeilaoRequest, LeilaoResponse } from "@/lib/auctions/types";
import { Usuario } from "@/lib/auth/types";
import { getAuthToken } from "@/lib/auth/getToken";

interface LancePageResponse {
  content: LanceResponse[];
}

export async function POST(request: NextRequest) {
  try {
    const body: any = await request.json();
    const token = await getAuthToken();
    const tokenPreview = token ? `${token.slice(0, 12)}...${token.slice(-8)}` : "ausente";

    const meResponse = await apiGet<Usuario>(`/users/me`);
    console.log("[client/lances][POST] Resposta de /users/me:", {
      ok: meResponse.ok,
      status: meResponse.status,
      hasData: Boolean(meResponse.data),
      hasError: Boolean(meResponse.error),
    });
    if (!meResponse.ok || !meResponse.data?.id) {
      console.log("[client/lances][POST] Falha ao resolver usuário via /users/me:", meResponse.error);
      return NextResponse.json(
        { message: "Usuário não autenticado" },
        { status: meResponse.status || 401 }
      );
    }
    const idUsuario = meResponse.data.id;
    console.log("[client/lances][POST] Usuário resolvido:", {
      id: meResponse.data.id,
      email: meResponse.data.email,
      nome: meResponse.data.nome,
    });

    const missingFields: string[] = [];
    if (!body.valor) missingFields.push("valor");
    if (!body.loteId) missingFields.push("loteId");

    if (missingFields.length > 0) {
      return NextResponse.json(
        { message: `Campos obrigatórios faltando: ${missingFields.join(", ")}` },
        { status: 400 }
      );
    }

    const leilaoData: LanceResponse = {
      ...body,
      usuarioId : idUsuario,
      valor: typeof body.valor === "string" 
        ? parseFloat(body.valor) 
        : body.valor,
    };

    const response = await apiPost<LeilaoResponse>(`/lances`, leilaoData);

    if (!response.ok) {
      return NextResponse.json(
        { message: response.error?.message || "Erro ao criar lance" },
        { status: response.status }
      );
    }

    return NextResponse.json(response.data, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar lance:", error);
    return NextResponse.json({ message: "Erro ao criar lance" }, { status: 500 });
  }
}
