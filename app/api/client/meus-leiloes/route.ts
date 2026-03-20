import { NextRequest, NextResponse } from "next/server";
import { apiGet } from "@/lib/api";
import { LeilaoResponse } from "@/lib/auctions/types";

interface LeilaoPageResponse {
  content: LeilaoResponse[];
}

export async function GET(request: NextRequest) {
  try {
    const response = await apiGet<LeilaoPageResponse>(`/leiloes/meus`);

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
