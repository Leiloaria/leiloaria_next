"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/lib/context";
import { Usuario, UserRequest } from "@/lib/auth/types";
import { ProfileHeader, ProfileForm } from "@/app/components/profile";

export default function ProfilePage() {
  const router = useRouter();
  const { user, refreshUser, loading: userLoading } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState<UserRequest>({
    nome: "",
    email: "",
    cpf: "",
    dataNascimento: "",
    telefone: [],
  });

  useEffect(() => {
    if (user) {
      setFormData({
        nome: user.nome ?? "",
        email: user.email ?? "",
        cpf: user.cpf ?? "",
        dataNascimento: user.dataNascimento ?? "",
        telefone: user.telefone ?? [],
      });
    }
  }, [user]);

  const handleSubmit = async (data: UserRequest) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      console.log("=== ProfilePage: Enviando PUT ===");
      console.log("Dados a enviar:", data);

      const response = await fetch("/api/auth/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      console.log("Status da resposta:", response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Erro da API:", errorData);
        setError(errorData.message || "Erro ao atualizar perfil");
        return;
      }

      const responseData = await response.json();
      console.log("Resposta com sucesso:", responseData);

      setSuccess(true);
      await refreshUser();

      // Mostrar mensagem de sucesso por 3 segundos
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      console.error("Erro ao atualizar perfil:", err);
      setError("Erro ao atualizar perfil");
    } finally {
      setIsLoading(false);
    }
  };

  if (userLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-[#414059]">Carregando...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-[#414059]">Usuário não encontrado</div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <div className="bg-white rounded-lg shadow-sm border border-[#F2F2F2] p-6">
        <ProfileHeader name={user.nome} />

        <ProfileForm
          initialData={formData}
          isLoading={isLoading}
          error={error}
          success={success}
          onSubmit={handleSubmit}
          onCancel={() => router.back()}
        />
      </div>
    </div>
  );
}
