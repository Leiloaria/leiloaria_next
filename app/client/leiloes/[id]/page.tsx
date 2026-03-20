"use client";

import { useState, useEffect } from "react";
import { LeilaoResponse } from "@/lib/auctions/types";
import { useParams, useRouter } from "next/navigation";
import { LanceFormData } from "@/lib/lances/types";
import LeilaoView from "@/app/components/client/leiloes/leilaoView";
import { Usuario } from "@/lib/auth";

export default function LeilaoPage() {
  const { id } = useParams();
  const [leilao, setLeilao] = useState<LeilaoResponse | undefined>(undefined);
  const [authUser, setAuthUser] = useState<Usuario | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const router = useRouter();
  useEffect(() => {
    fetchLeilao();
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await fetch("/api/auth/me");
      if (response.ok) {
        const data = await response.json();
        setAuthUser(data as Usuario);
      } else {
        setAuthUser(null);
      }
    } catch (e) {
      setAuthUser(null);
    }
  }

  const fetchLeilao = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/client/leiloes/${id}`);
      if (response.ok) {
        const data = await response.json();
        setLeilao(data);
      } else {
        if (response.status === 404) {
          alert("Leilão não encontrado");
        } else {
          alert("Erro ao buscar leilão");
        }
        handleCloseForm();
      }
    } catch (e) {
      alert("Erro ao buscar leilão");
      handleCloseForm();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      fetchLeilao();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  

  const handleCloseForm = () => {
    router.push("/client/leiloes");
  };

  const handleSubmitLance = async (data: LanceFormData) => {
    setIsSaving(true);
    try {
      const response = await fetch("/api/client/lances", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        alert("Lance criado com sucesso");
        await fetchLeilao();
      } else {
        const error = await response.json();
        alert(error.message || "Erro ao criar lance");
      }
    } catch (e) {
      alert("Erro ao criar leilão");
    } finally {
      setIsSaving(false);
    }
  };

  if (!leilao) {
    return <div>Carregando...</div>;
  }

  return (
    <LeilaoView onSubmitLance={handleSubmitLance} isLoading={isSaving} leilao={leilao}/>
  );
}