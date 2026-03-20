"use client";

import React, { useState, useEffect } from "react";
import { CategoriaRequest, CategoriaResponse } from "@/lib/categories/types";

interface CategoryFormProps {
  category?: CategoriaResponse | null;
  title?: string;
  onSubmit: (data: CategoriaRequest) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

export default function CategoryForm({
  category,
  title,
  onSubmit,
  onCancel,
  isLoading,
}: CategoryFormProps) {
  const [nome, setNome] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setNome(category?.nome || "");
    setError("");
  }, [category]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!nome.trim() || nome.length < 3) {
      setError("Nome deve ter pelo menos 3 caracteres");
      return;
    }
    await onSubmit({ nome });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-bold text-[#635EF2] mb-4">
          {title || (category ? "Editar Categoria" : "Nova Categoria")}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#414059] mb-2">
              Nome
            </label>
            <input
              type="text"
              value={nome}
              onChange={e => setNome(e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none transition ${
                error ? "border-[#F2A2A9] focus:border-[#F2A2A9]" : "border-[#F2F2F2] focus:border-[#635EF2]"
              }`}
              placeholder="Nome da categoria"
              disabled={isLoading}
            />
            {error && <p className="text-sm text-[#F2A2A9] mt-1">{error}</p>}
          </div>
          <div className="flex gap-3 pt-4 border-t border-[#F2F2F2]">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-[#635EF2] text-white rounded-lg hover:bg-[#4F46E5] transition disabled:opacity-50 font-medium"
            >
              {isLoading ? "Salvando..." : category ? "Atualizar" : "Criar"}
            </button>
            <button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-[#F2F2F2] text-[#414059] rounded-lg hover:bg-[#E8E8F0] transition disabled:opacity-50 font-medium"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
