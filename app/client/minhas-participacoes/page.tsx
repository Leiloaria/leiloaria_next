"use client";

import React, { useState, useEffect } from "react";
import { LeilaoResponse, LeilaoFormData } from "@/lib/auctions/types";
import { LeilaoForm, LeilaoList } from "@/app/components/client/leiloes";
import { useRouter } from 'next/navigation';

export default function LeiloesPage() {
  const router = useRouter();
  const [leiloes, setLeiloes] = useState<LeilaoResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchLeiloes();
  }, []);

  const fetchLeiloes = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/client/minhas-participacoes");
      if (response.ok) {
        const data = await response.json();
        const list = Array.isArray(data.auctions) ? data.auctions : [];
        setLeiloes(list);
      } else {
        setLeiloes([]);
      }
    } catch (e) {
      setLeiloes([]);
    } finally {
      setIsLoading(false);
    }
  };

  const view = (id: number) => {
    router.push(`/client/minhas-participacoes/${id}`);
  }


  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-[#414059]">Minhas Participações</h1>
      </div>
      <LeilaoList leiloes={leiloes} isLoading={isLoading} handleClick={view} fromOwner={true} />
    </div>
  );
}
