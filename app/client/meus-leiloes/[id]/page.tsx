"use client";

import { useState, useEffect } from "react";
import { LeilaoFormData, LeilaoResponse } from "@/lib/auctions/types";
import { useParams, useRouter } from "next/navigation";
import { LeilaoForm } from "@/app/components/client/leiloes";

export default function LeilaoPage() {
  const { id } = useParams();
  const [leilao, setLeilao] = useState<LeilaoResponse | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const router = useRouter();
  useEffect(() => {
    fetchLeilao();
  }, [id]);

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
    router.push("/client/meus-leiloes");
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja cancelar este leilão?")) return;
    try {
      const response = await fetch(`/api/client/leiloes/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        router.push(`/client/meus-leiloes`);
      } else {
        const error = await response.json();
        alert(error.message || "Erro ao cancelar leilão");
      }
    } catch (e) {
      alert("Erro ao cancelar leilão");
    }
  };

  const handleSubmit = async (data: LeilaoFormData) => {
      setIsSaving(true);
      try {
        const response = await fetch(`/api/client/leiloes/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (response.ok) {
          alert("Êxito ao atualizar leilão!");
          setLeilao(await response.json());
        } else {
          const error = await response.json();
          alert(error.message || "Erro ao atualizar leilão");
        }
      } catch (e) {
        alert("Erro ao atualizar leilão");
      } finally {
        setIsSaving(false);
      }
    };

  if (!leilao) {
    return <div>Carregando...</div>;
  }

  return (
    <LeilaoForm handleClose={handleCloseForm} isLoading={isLoading} isEditing={true} leilao={leilao} onSubmit={handleSubmit} onCancel={handleDelete}/>
  );
}