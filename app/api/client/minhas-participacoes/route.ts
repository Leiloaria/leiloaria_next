import { NextRequest, NextResponse } from "next/server";
import { apiGet } from "@/lib/api";
import { LeilaoResponse } from "@/lib/auctions/types";
import { Usuario } from "@/lib/auth/types";

interface LeilaoPageResponse {
  content: LeilaoResponse[];
}

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

export async function GET(request: NextRequest) {
  try {

    const user = await recoverAuthUser();
    if (!user) {
      return NextResponse.json({ message: "Usuário não autenticado" }, { status: 401 });
    }
    
    const response = await apiGet<LeilaoPageResponse>(`/leiloes/participante/${user.id}`);
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
