"use client";

import React, { useState } from "react";
import { Usuario } from "@/lib/auth/types";

interface UserActionsProps {
  user: Usuario;
  onEdit: (user: Usuario) => void;
  onDelete: (id: number) => void;
}

export default function UserActions({
  user,
  onEdit,
  onDelete,
}: UserActionsProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Tem certeza que deseja excluir este usuário?")) {
      return;
    }

    setIsDeleting(true);
    try {
      await onDelete(user.id);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex items-center justify-center gap-3">
      <button
        onClick={() => onEdit(user)}
        className="px-3 py-1 text-sm bg-[#635EF2] text-white rounded-lg hover:bg-[#4F46E5] transition"
        title="Editar usuário"
      >
        Editar
      </button>
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className="px-3 py-1 text-sm bg-[#F2A2A9] text-white rounded-lg hover:bg-[#E88B95] transition disabled:opacity-50"
        title="Excluir usuário"
      >
        {isDeleting ? "..." : "Excluir"}
      </button>
    </div>
  );
}
