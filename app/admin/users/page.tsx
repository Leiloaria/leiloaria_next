"use client";

import React, { useState, useEffect } from "react";
import { Usuario, UserFormData } from "@/lib/auth/types";
import { UsersTable, UserForm } from "@/app/components/admin/users";

export default function UsersPage() {
  const [users, setUsers] = useState<Usuario[]>([]);
  const [selectedUser, setSelectedUser] = useState<Usuario | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Carrega usuários ao montar o componente
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/admin/users");
      if (response.ok) {
        const data = await response.json();
        // Garante que sempre será um array
        const usersList = Array.isArray(data.users) ? data.users : [];
        setUsers(usersList);
      } else {
        console.error("Erro ao buscar usuários:", response.status);
        setUsers([]);
      }
    } catch (error) {
      console.error("Erro ao carregar usuários:", error);
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenForm = (user?: Usuario) => {
    setSelectedUser(user || null);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedUser(null);
  };

  const handleSubmit = async (data: UserFormData) => {
    if (!selectedUser) {
      alert("Nenhum usuário selecionado para atualização");
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch(`/api/admin/users/${selectedUser.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        handleCloseForm();
        await fetchUsers();
      } else {
        const error = await response.json();
        alert(error.message || "Erro ao atualizar usuário");
      }
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
      alert("Erro ao atualizar usuário");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/admin/users/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchUsers();
      } else {
        const error = await response.json();
        alert(error.message || "Erro ao excluir usuário");
      }
    } catch (error) {
      console.error("Erro ao excluir usuário:", error);
      alert("Erro ao excluir usuário");
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-[#635EF2]">Usuários</h1>
        </div>
        <p className="text-[#414059]">Gerenciar usuários da plataforma</p>
      </div>

      <div className="bg-white rounded-lg border border-[#F2F2F2] overflow-hidden">
        <UsersTable
          users={users}
          onEdit={handleOpenForm}
          onDelete={handleDelete}
          isLoading={isLoading}
        />
      </div>

      {isFormOpen && (
        <UserForm
          user={selectedUser}
          onSubmit={handleSubmit}
          onCancel={handleCloseForm}
          isLoading={isSaving}
        />
      )}
    </div>
  );
}
