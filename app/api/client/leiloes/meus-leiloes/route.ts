import { NextRequest, NextResponse } from "next/server";
import { apiGet, apiPost } from "@/lib/api";
import { LeilaoRequest, LeilaoResponse } from "@/lib/auctions/types";
import { Usuario } from "@/lib/auth/types";
import { getAuthToken } from "@/lib/auth/getToken";


interface LeilaoPageResponse {
  content: LeilaoResponse[];
}

export async function GET(request: NextRequest) {
  try {
    const meResponse = await apiGet<Usuario>(`/users/me`);
    
    if (!meResponse.ok || !meResponse.data?.id) {
      console.log("[client/leiloes][POST] Falha ao resolver usuário via /users/me:", meResponse.error);
      return NextResponse.json(
        { message: "Usuário não autenticado" },
        { status: meResponse.status || 401 }
      );
    }

    const response = await apiGet<LeilaoResponse[]>(`/leiloes?proprietario.id=${meResponse.data.id}`);

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