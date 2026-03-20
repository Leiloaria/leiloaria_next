"use client";

import { LeilaoResponse, StatusLeilao } from "@/lib/auctions/types";

interface LeilaoListProps {
  leiloes: LeilaoResponse[];
  isLoading: boolean;
  handleClick: (id: number) => void;
  fromOwner?: boolean;
}

export default function LeilaoList({ leiloes, isLoading, handleClick, fromOwner=false }: LeilaoListProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <p className="text-[#414059]">Carregando leilões...</p>
      </div>
    );
  }

  if (leiloes.length === 0) {
    return (
      <div className="flex justify-center py-12">
        <p className="text-[#414059]">Nenhum leilão encontrado. Comece criando um novo!</p>
      </div>
    );
  }

  const formatDateTime = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleString("pt-BR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "-";
    }
  };

  const getStatusBadgeColor = (status: StatusLeilao) => {
    switch (status) {
      case StatusLeilao.ABERTO:
        return "bg-[#E8F5E9] text-[#2E7D32]";
      case StatusLeilao.FINALIZADO:
        return "bg-[#F3E5F5] text-[#6A1B9A]";
      case StatusLeilao.CANCELADO:
        return "bg-[#FFEBEE] text-[#C62828]";
      case StatusLeilao.AGUARDANDO_PAGAMENTO:
        return "bg-[#FFF8E1] text-[#F57F17]";
      case StatusLeilao.PENDENTE:
        return "bg-[#E3F2FD] text-[#1976D2]";
      default:
        return "bg-[#F2F2F2] text-[#414059]";
    }
  };

  const formatCurrency = (value: unknown) => {
    const numberValue = Number(value);
    if (!Number.isFinite(numberValue)) {
      return "-";
    }

    return numberValue.toFixed(2);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {leiloes.map((leilao) => (
        <div
          key={leilao.id}
          className="bg-white rounded-lg shadow-md hover:shadow-lg transition p-4 border border-[#F2F2F2]"
        >
          {/* Header com status */}
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-lg font-bold text-[#414059] flex-1 line-clamp-2">
              {leilao?.lote?.nome}
            </h3>
            <span
              className={`ml-2 px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getStatusBadgeColor(
                leilao.status
              )}`}
            >
              {leilao.status}
            </span>
          </div>

          {/* Descrição */}
          <p className="text-sm text-[#656565] mb-3 line-clamp-2">
            {leilao?.lote?.descricao?.trim() || "Sem descrição"}
          </p>

          {/* Lance Mínimo */}
          <div className="mb-3 pb-3 border-b border-[#F2F2F2]">
            <p className="text-xs text-[#656565] mb-1">Lance Mínimo</p>
            <p className="text-lg font-bold text-[#635EF2]">
              R$ {formatCurrency(leilao?.lote?.lanceMinimo)}
            </p>
          </div>

          {/* Datas */}
          <div className="grid grid-cols-2 gap-3 mb-4 text-xs text-[#656565]">
            <div>
              <p className="font-medium text-[#414059]">Início</p>
              <p>{formatDateTime(leilao.inicio)}</p>
            </div>
            <div>
              <p className="font-medium text-[#414059]">Fim</p>
              <p>{formatDateTime(leilao.fim)}</p>
            </div>
          </div>

          {/* Itens */}
          {leilao?.lote?.itens && leilao.lote.itens.length > 0 && (
            <div className="mb-3 pb-3 border-t border-[#F2F2F2] pt-3">
              <p className="text-xs font-medium text-[#414059] mb-1">
                {leilao.lote?.itens?.length} item(ns)
              </p>
              <div className="space-y-1">
                {leilao.lote?.itens?.slice(0, 2).map((item) => (
                  <p key={item.id} className="text-xs text-[#656565] truncate">
                    • {item.nome}
                  </p>
                ))}
                {leilao.lote?.itens?.length > 2 && (
                  <p className="text-xs text-[#635EF2] font-medium">
                    +{leilao.lote?.itens?.length - 2} mais
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Ações */}
          <button
            onClick={() => handleClick(leilao.id)}
            className="w-full px-3 py-2 text-sm bg-[#635EF2] text-white rounded hover:bg-[#4A47B5] transition cursor-pointer">
            {leilao.status === StatusLeilao.ABERTO && !fromOwner ? "Participar" : "Ver detalhes"}
          </button>
        </div>
      ))}
    </div>
  );
}
