"use client";

import React from "react";
import { Usuario } from "@/lib/auth/types";
import UserActions from "./UserActions";

interface UsersTableProps {
  users: Usuario[];
  onEdit: (user: Usuario) => void;
  onDelete: (id: number) => void;
  isLoading: boolean;
}

export default function UsersTable({
  users,
  onEdit,
  onDelete,
  isLoading,
}: UsersTableProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <p className="text-[#414059]">Carregando...</p>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="flex justify-center py-8">
        <p className="text-[#414059]">Nenhum usuário encontrado</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-[#F8F8FA] border-b border-[#F2F2F2]">
            <th className="px-3 py-3 text-left font-semibold text-[#414059]">
              ID
            </th>
            <th className="px-3 py-3 text-left font-semibold text-[#414059]">
              Nome
            </th>
            <th className="px-3 py-3 text-left font-semibold text-[#414059]">
              Email
            </th>
            <th className="px-3 py-3 text-left font-semibold text-[#414059]">
              CPF
            </th>
            <th className="px-3 py-3 text-left font-semibold text-[#414059]">
              Data Nascimento
            </th>
            <th className="px-3 py-3 text-left font-semibold text-[#414059]">
              Telefone
            </th>
            <th className="px-3 py-3 text-left font-semibold text-[#414059]">
              Status
            </th>
            <th className="px-3 py-3 text-center font-semibold text-[#414059]">
              Ações
            </th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr
              key={user.id}
              className="border-b border-[#F2F2F2] hover:bg-[#F8F8FA] transition"
            >
              <td className="px-3 py-3 text-[#414059]">{user.id}</td>
              <td className="px-3 py-3 text-[#414059] font-medium">{user.nome}</td>
              <td className="px-3 py-3 text-[#414059]">{user.email}</td>
              <td className="px-3 py-3 text-[#414059]">{user.cpf}</td>
              <td className="px-3 py-3 text-[#414059]">
                {new Date(user.dataNascimento).toLocaleDateString("pt-BR")}
              </td>
              <td className="px-3 py-3 text-[#414059]">
                {user.telefone && user.telefone.length > 0 ? (
                  <div className="flex flex-col gap-1">
                    {user.telefone.map((tel, idx) => (
                      <span key={idx} className="block">{tel}</span>
                    ))}
                  </div>
                ) : (
                  <span className="text-[#A9A5B8]">-</span>
                )}
              </td>
              <td className="px-3 py-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  user.ativo
                    ? "bg-[#E8F5E9] text-[#2E7D32]"
                    : "bg-[#FFEBEE] text-[#C62828]"
                }`}>
                  {user.ativo ? "Ativo" : "Inativo"}
                </span>
              </td>
              <td className="px-3 py-3 text-center">
                <UserActions
                  user={user}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
