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
    const body: any = await request.json();

    console.log("[client/leiloes][POST] Iniciando criação de leilão");
    console.log("[client/leiloes][POST] Campos recebidos:", Object.keys(body || {}));

    const token = await getAuthToken();
    const tokenPreview = token ? `${token.slice(0, 12)}...${token.slice(-8)}` : "ausente";
    console.log("[client/leiloes][POST] Token disponível no BFF:", token ? "sim" : "não", "preview:", tokenPreview);
    console.log("[client/leiloes][POST] Resolvendo usuário autenticado via GET /users/me (sem body, somente Authorization via api.ts)");

    const meResponse = await apiGet<Usuario>(`/users/me`);
    console.log("[client/leiloes][POST] Resposta de /users/me:", {
      ok: meResponse.ok,
      status: meResponse.status,
      hasData: Boolean(meResponse.data),
      hasError: Boolean(meResponse.error),
    });
    if (!meResponse.ok || !meResponse.data?.id) {
      console.log("[client/leiloes][POST] Falha ao resolver usuário via /users/me:", meResponse.error);
      return NextResponse.json(
        { message: "Usuário não autenticado" },
        { status: meResponse.status || 401 }
      );
    }
    const idUsuario = meResponse.data.id;
    console.log("[client/leiloes][POST] Usuário resolvido:", {
      id: meResponse.data.id,
      email: meResponse.data.email,
      nome: meResponse.data.nome,
    });

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

    if (!body.descricao || body.descricao.length < 3) {
        return NextResponse.json(
          { message: "A descrição deve ter pelo menos 3 caracteres" },
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
       if (!item.descricao || item.descricao.length < 3) {
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

    const leilaoData: LeilaoRequest = {
      ...body,
      idUsuario,
      lanceMinimo: typeof body.lanceMinimo === "string" 
        ? parseFloat(body.lanceMinimo) 
        : body.lanceMinimo,
    };

    const response = await apiPost<LeilaoResponse>(`/leiloes`, leilaoData);
    console.log("[client/leiloes][POST] Resposta criação leilão:", {
      ok: response.ok,
      status: response.status,
      hasData: Boolean(response.data),
      hasError: Boolean(response.error),
    });

    if (!response.ok) {
      return NextResponse.json(
        { message: response.error?.message || "Erro ao criar leilão" },
        { status: response.status }
      );
    }

    return NextResponse.json(response.data, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar leilão:", error);
    return NextResponse.json({ message: "Erro ao criar leilão" }, { status: 500 });
  }
}
