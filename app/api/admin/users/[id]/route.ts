import { NextRequest, NextResponse } from "next/server";
import { apiPut, apiDelete } from "@/lib/api";
import { UserRequest, Usuario } from "@/lib/auth/types";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    console.log("[PUT /api/admin/users/:id] Iniciando atualização do usuário:", id);

    const body: UserRequest = await request.json();
    const { nome, email, cpf, dataNascimento, telefone } = body;
    console.log("[PUT /api/admin/users/:id] Dados recebidos:", { nome, email, cpf, dataNascimento, telefone });

    if (!nome || !email || !cpf || !dataNascimento) {
      console.log("[PUT /api/admin/users/:id] Validação falhou - campos obrigatórios ausentes");
      return NextResponse.json(
        { message: "Nome, e-mail, CPF e data de nascimento são obrigatórios" },
        { status: 400 }
      );
    }

    const userPayload: UserRequest = {
      nome,
      email,
      cpf,
      dataNascimento,
      telefone: Array.isArray(telefone) ? telefone : [],
    };
    console.log("[PUT /api/admin/users/:id] Payload preparado:", userPayload);

    const url = `/users/${id}`;
    console.log("[PUT /api/admin/users/:id] Enviando requisição para:", url);

    const response = await apiPut<Usuario>(url, userPayload);

    console.log("[PUT /api/admin/users/:id] Resposta do backend - Status:", response.status);

    if (!response.ok) {
      console.error("[PUT /api/admin/users/:id] Erro do backend:", response.error);
      return NextResponse.json(
        { message: response.error?.message || "Erro ao atualizar usuário" },
        { status: response.status }
      );
    }

    console.log("[PUT /api/admin/users/:id] Usuário atualizado com sucesso:", response.data);
    return NextResponse.json(response.data);
  } catch (error) {
    console.error("[PUT /api/admin/users/:id] Erro:", error);
    return NextResponse.json(
      { message: "Erro ao atualizar usuário" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const response = await apiDelete(`/users/${id}`);

    if (!response.ok) {
      return NextResponse.json(
        { message: response.error?.message || "Erro ao excluir usuário" },
        { status: response.status }
      );
    }

    return NextResponse.json({ message: "Usuário excluído com sucesso" });
  } catch (error) {
    console.error("Erro ao excluir usuário:", error);
    return NextResponse.json(
      { message: "Erro ao excluir usuário" },
      { status: 500 }
    );
  }
}
