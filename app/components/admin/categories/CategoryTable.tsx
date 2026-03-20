"use client";

import React from "react";
import { CategoriaResponse } from "@/lib/categories/types";

interface CategoryTableProps {
  categories: CategoriaResponse[];
  onEdit: (cat: CategoriaResponse) => void;
  onAddSubcategory: (cat: CategoriaResponse) => void;
  onDelete: (id: number) => void;
  isLoading: boolean;
}

export default function CategoryTable({
  categories,
  onEdit,
  onAddSubcategory,
  onDelete,
  isLoading,
}: CategoryTableProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <p className="text-[#414059]">Carregando...</p>
      </div>
    );
  }
  if (categories.length === 0) {
    return (
      <div className="flex justify-center py-8">
        <p className="text-[#414059]">Nenhuma categoria encontrada</p>
      </div>
    );
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-[#F8F8FA] border-b border-[#F2F2F2]">
            <th className="px-3 py-3 text-left font-semibold text-[#414059]">ID</th>
            <th className="px-3 py-3 text-left font-semibold text-[#414059]">Nome</th>
            <th className="px-3 py-3 text-left font-semibold text-[#414059]">Subcategorias</th>
            <th className="px-3 py-3 text-center font-semibold text-[#414059]">Ações</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat) => (
            <tr key={cat.id} className="border-b border-[#F2F2F2] hover:bg-[#F8F8FA] transition">
              <td className="px-3 py-3 text-[#414059]">{cat.id}</td>
              <td className="px-3 py-3 text-[#414059] font-medium">{cat.nome}</td>
              <td className="px-3 py-3 text-[#414059]">
                {cat.subcategorias && cat.subcategorias.length > 0 ? (
                  <ul className="list-disc pl-4">
                    {cat.subcategorias.map((sub) => (
                      <li key={sub.id}>{sub.nome}</li>
                    ))}
                  </ul>
                ) : (
                  <span className="text-[#A9A5B8]">-</span>
                )}
              </td>
              <td className="px-3 py-3 text-center">
                <button
                  onClick={() => onEdit(cat)}
                  className="px-3 py-1 text-sm bg-[#635EF2] text-white rounded-lg hover:bg-[#4F46E5] transition mr-2"
                  title="Editar categoria"
                >
                  Editar
                </button>
                <button
                  onClick={() => onAddSubcategory(cat)}
                  className="px-3 py-1 text-sm bg-[#8B86C4] text-white rounded-lg hover:bg-[#7670B6] transition mr-2"
                  title="Adicionar subcategoria"
                >
                  Subcategoria
                </button>
                <button
                  onClick={() => onDelete(cat.id)}
                  className="px-3 py-1 text-sm bg-[#F2A2A9] text-white rounded-lg hover:bg-[#E88B95] transition"
                  title="Excluir categoria"
                >
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
