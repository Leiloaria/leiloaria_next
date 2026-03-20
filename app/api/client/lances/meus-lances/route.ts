import { apiDelete, apiGet } from "@/lib/api";
import { MeusLancesResponse } from "@/lib/auctions/types";
import { Usuario } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";


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

    const response = await apiGet<MeusLancesResponse[]>(`/users/${meResponse.data.id}/lances`);

    if (!response.ok) {
      return NextResponse.json({ message: "Erro ao buscar lances" }, { status: response.status });
    }

    const data = response.data as MeusLancesResponse[];

    return NextResponse.json({ bids: data });
  } catch (error) {
    return NextResponse.json({ message: "Erro ao buscar lances" }, { status: 500 });
  }
}