import { apiDelete } from "@/lib/api";
import { NextRequest, NextResponse } from "next/server";


type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function DELETE(_request: NextRequest,
  { params }: RouteContext) {
  try {
    const { id } = await params;
    const response = await apiDelete<void>(`/lances/${id}`);

    if (!response.ok) {
      return NextResponse.json(
        { message: response.error?.message || "Erro ao remover lance" },
        { status: response.status }
      );
    }

    return NextResponse.json({ status: 200 });
  }catch (error) {
    console.error("Erro ao remover lance:", error);
    return NextResponse.json({ message: "Erro ao remover lance" }, { status: 500 });
  }
}
