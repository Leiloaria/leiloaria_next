import { NextRequest, NextResponse } from "next/server";
import { apiGet, apiPut } from "@/lib/api";
import { getAuthToken } from "@/lib/auth/getToken";
import { Usuario, UserRequest } from "@/lib/auth/types";

export async function GET(request: NextRequest) {
  try {
    const token = await getAuthToken();

    if (!token) {
      return NextResponse.json(
        { message: "Não autenticado" },
        { status: 401 }
      );
    }

    const response = await apiGet<Usuario>(`/users/me`);

    if (!response.ok) {
      return NextResponse.json(
        { message: "Erro ao buscar usuário" },
        { status: response.status }
      );
    }

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    return NextResponse.json(
      { message: "Erro ao buscar usuário" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const token = await getAuthToken();

    if (!token) {
      return NextResponse.json(
        { message: "Não autenticado" },
        { status: 401 }
      );
    }

    const body: UserRequest = await request.json();
    
    console.log("=== PUT /api/auth/me ===");
    console.log("Body recebido:", JSON.stringify(body, null, 2));
    console.log("Token presente:", !!token);

    const response = await apiPut<Usuario>(`/users/me`, body);
    
    console.log("Resposta da API backend:", response);

    if (!response.ok) {
      console.error("❌ Falha na API:", { status: response.status, error: response.error });
      return NextResponse.json(
        { message: "Erro ao atualizar usuário", error: response.error },
        { status: response.status }
      );
    }

    console.log("Usuário atualizado com sucesso:", response.data);
    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    return NextResponse.json(
      { message: "Erro ao atualizar usuário", error: String(error) },
      { status: 500 }
    );
  }
}
