import { apiPost, apiPut } from "@/lib/api";
import { StatusPagamento, UpdateVendaRequest, VendaRequest, VendaResponse } from "@/lib/vendas/types";
import { NextRequest, NextResponse } from "next/server";
import { API_GATEWAY_TOKEN } from "@/lib/config";

type RouteContext = {
    params: Promise<{ id: string }>;
};

export async function POST(request: NextRequest, { params }: RouteContext) {
    try {
        const { id } = await params;
        const body: any = await request.json();

        const missingFields: string[] = [];
        if (!body.formaPagamento) missingFields.push("formaPagamento");

        if (missingFields.length > 0) {
            return NextResponse.json(
                { message: `Campos obrigatórios faltando: ${missingFields.join(", ")}` },
                { status: 400 }
            );
        }

        const pagamentoData: VendaRequest = {
            ...body,
        };

        const response = await apiPost<VendaResponse>(`/vendas/pagamento/${id}`, pagamentoData);

        if (!response.ok) {
            return NextResponse.json(
                { message: response.error?.message || "Erro ao finalizar pagamento" },
                { status: response.status }
            );
        }

        return NextResponse.json(response.data, { status: 201 });
    } catch (error) {
        console.error("Erro ao finalizar pagamento:", error);
        return NextResponse.json({ message: "Erro ao finalizar pagamento" }, { status: 500 });
    }
}

export async function PUT(request: NextRequest, { params }: RouteContext) {
    try {
        const { id } = await params;

        const pagamentoData: UpdateVendaRequest = {
            statusPagamento: StatusPagamento.APROVADO
        };

        const response = await apiPut<VendaResponse>(`/vendas/pagamento/${id}`, pagamentoData, { 'Authorization': API_GATEWAY_TOKEN }, true);

        if (!response.ok) {
            return NextResponse.json(
                { message: response.error?.message || "Erro ao atualizar status pagamento" },
                { status: response.status }
            );
        }

        return NextResponse.json(response.data, { status: 201 });
    } catch (error) {
        console.error("Erro ao finalizar pagamento:", error);
        return NextResponse.json({ message: "Erro ao atualizar status pagamento" }, { status: 500 });
    }
}