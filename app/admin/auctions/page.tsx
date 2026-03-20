"use client";

import React, { useState, useEffect } from "react";
import { LeilaoResponse } from "@/lib/auctions/types";
import { AuctionTable } from "@/app/components/admin/auctions";

export default function AuctionsPage() {
  const [auctions, setAuctions] = useState<LeilaoResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAuctions();
  }, []);

  const fetchAuctions = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/admin/auctions");
      if (response.ok) {
        const data = await response.json();
        const list = Array.isArray(data.auctions) ? data.auctions : [];
        setAuctions(list);
      } else {
        setAuctions([]);
      }
    } catch (e) {
      setAuctions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja cancelar este leilão?")) return;
    try {
      const response = await fetch(`/api/admin/auctions/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        await fetchAuctions();
      } else {
        const error = await response.json();
        alert(error.message || "Erro ao cancelar leilão");
      }
    } catch (e) {
      alert("Erro ao cancelar leilão");
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-[#635EF2]">Leilões</h1>
        </div>
        <p className="text-[#414059]">Gerencie os leilões da plataforma</p>
      </div>
      <div className="bg-white rounded-lg border border-[#F2F2F2] overflow-hidden">
        <AuctionTable
          auctions={auctions}
          onDelete={handleDelete}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
