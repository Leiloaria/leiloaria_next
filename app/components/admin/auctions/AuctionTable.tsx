"use client";

import React from "react";
import { LeilaoResponse, StatusLeilao } from "@/lib/auctions/types";

interface AuctionTableProps {
  auctions: LeilaoResponse[];
  onDelete: (id: number) => void;
  isLoading: boolean;
}

export default function AuctionTable({
  auctions,
  onDelete,
  isLoading,
}: AuctionTableProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <p className="text-[#414059]">Carregando...</p>
      </div>
    );
  }

  if (auctions.length === 0) {
    return (
      <div className="flex justify-center py-8">
        <p className="text-[#414059]">Nenhum leilão encontrado</p>
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
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-[#F8F8FA] border-b border-[#F2F2F2]">
            <th className="px-3 py-3 text-left font-semibold text-[#414059]">ID</th>
            <th className="px-3 py-3 text-left font-semibold text-[#414059]">Nome</th>
            <th className="px-3 py-3 text-left font-semibold text-[#414059]">Lance Mínimo</th>
            <th className="px-3 py-3 text-left font-semibold text-[#414059]">Início</th>
            <th className="px-3 py-3 text-left font-semibold text-[#414059]">Fim</th>
            <th className="px-3 py-3 text-left font-semibold text-[#414059]">Status</th>
            <th className="px-3 py-3 text-center font-semibold text-[#414059]">Ações</th>
          </tr>
        </thead>
        <tbody>
          {auctions.map((auction) => (
            <tr
              key={auction.id}
              className="border-b border-[#F2F2F2] hover:bg-[#F8F8FA] transition"
            >
              <td className="px-3 py-3 text-[#414059]">{auction.id}</td>
              <td className="px-3 py-3 text-[#414059] font-medium">{auction?.lote?.nome}</td>
              <td className="px-3 py-3 text-[#414059]">R$ {formatCurrency(auction?.lote?.lanceMinimo)}</td>
              <td className="px-3 py-3 text-[#414059] text-xs">
                {formatDateTime(auction.inicio)}
              </td>
              <td className="px-3 py-3 text-[#414059] text-xs">
                {formatDateTime(auction.fim)}
              </td>
              <td className="px-3 py-3">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(
                    auction.status
                  )}`}
                >
                  {auction.status}
                </span>
              </td>
              <td className="px-3 py-3 text-center">
                <button
                  onClick={() => onDelete(auction.id)}
                  className={
                  `px-3 py-1 text-sm rounded-lg transition ${auction.status === "PENDENTE" ? "bg-[#df515d] text-white hover:bg-[#E88B95] cursor-pointer" : "bg-[#d9a8ac] text-white cursor-not-allowed"
                  }`
                  }
                  title="Cancelar leilão"
                  disabled={auction.status !== "PENDENTE"}
                >
                  Cancelar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
