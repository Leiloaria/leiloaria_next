"use client";

import React, { useState, useEffect } from "react";
import { LeilaoResponse, LeilaoFormData } from "@/lib/auctions/types";
import { LeilaoForm, LeilaoList } from "@/app/components/client/leiloes";
import { useRouter } from 'next/navigation';

export default function LeiloesPage() {
  const router = useRouter();
  const [leiloes, setLeiloes] = useState<LeilaoResponse[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchLeiloes();
  }, []);

  const fetchLeiloes = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/client/leiloes/meus-leiloes");
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

  const editar = (id: number) => {
    router.push(`/client/meus-leiloes/${id}`);
  }

  const handleCloseForm = () => {
    setIsFormOpen(false);
  };

  const handleSubmit = async (data: LeilaoFormData) => {
    setIsSaving(true);
    try {
      const response = await fetch("/api/client/leiloes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        handleCloseForm();
        await fetchLeiloes();
      } else {
        const error = await response.json();
        alert(error.message || "Erro ao criar leilão");
      }
    } catch (e) {
      alert("Erro ao criar leilão");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-[#414059]">Meus Leilões</h1>
        <button
          onClick={() => setIsFormOpen(true)}
          className="px-4 py-2 bg-[#635EF2] text-white rounded-lg hover:bg-[#4A47B5] transition font-medium"
        >
          + Novo Leilão
        </button>
      </div>

      {isFormOpen && (
        <LeilaoForm onSubmit={handleSubmit} handleClose={handleCloseForm} isLoading={isSaving} />
      )}

      <LeilaoList leiloes={leiloes} isLoading={isLoading} handleClick={editar} fromOwner={true} />
    </div>
  );
}
