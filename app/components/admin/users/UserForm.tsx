"use client";

import React, { useState, useEffect } from "react";
import { Usuario, UserFormData } from "@/lib/auth/types";

interface UserFormProps {
  user?: Usuario | null;
  onSubmit: (data: UserFormData) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validateCPF = (cpf: string): boolean => {
  const cleanCPF = cpf.replace(/\D/g, "");
  return cleanCPF.length === 11;
};

export default function UserForm({
  user,
  onSubmit,
  onCancel,
  isLoading,
}: UserFormProps) {
  const [formData, setFormData] = useState<UserFormData>({
    nome: "",
    email: "",
    cpf: "",
    dataNascimento: "",
    telefone: [],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [telefoneInput, setTelefoneInput] = useState("");

  useEffect(() => {
    if (user) {
      setFormData({
        nome: user.nome || "",
        email: user.email || "",
        cpf: user.cpf || "",
        dataNascimento: user.dataNascimento || "",
        telefone: Array.isArray(user.telefone) ? user.telefone : [],
      });
      setTelefoneInput(Array.isArray(user.telefone) && user.telefone[0] ? user.telefone[0] : "");
    } else {
      // Reset para um novo usuário
      setFormData({
        nome: "",
        email: "",
        cpf: "",
        dataNascimento: "",
        telefone: [],
      });
      setTelefoneInput("");
    }
  }, [user]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.nome.trim()) {
      newErrors.nome = "Nome obrigatório";
    } else if (formData.nome.trim().length < 3) {
      newErrors.nome = "Nome deve ter no mínimo 3 caracteres";
    }

    if (!formData.email.trim()) {
      newErrors.email = "E-mail obrigatório";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Formato de e-mail inválido";
    }

    if (!formData.cpf.trim()) {
      newErrors.cpf = "CPF obrigatório";
    } else if (!validateCPF(formData.cpf)) {
      newErrors.cpf = "CPF inválido";
    }

    if (!formData.dataNascimento) {
      newErrors.dataNascimento = "Data de nascimento obrigatória";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleAddPhone = () => {
    if (telefoneInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        telefone: [...prev.telefone, telefoneInput],
      }));
      setTelefoneInput("");
    }
  };

  const handleRemovePhone = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      telefone: prev.telefone.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    await onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold text-[#635EF2] mb-4">
          Editar Usuário
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nome */}
          <div>
            <label className="block text-sm font-medium text-[#414059] mb-2">
              Nome *
            </label>
            <input
              type="text"
              name="nome"
              value={formData.nome || ""}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none transition ${
                errors.nome
                  ? "border-[#F2A2A9] focus:border-[#F2A2A9]"
                  : "border-[#F2F2F2] focus:border-[#635EF2]"
              }`}
              placeholder="Nome completo"
              disabled={isLoading}
            />
            {errors.nome && (
              <p className="text-sm text-[#F2A2A9] mt-1">{errors.nome}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-[#414059] mb-2">
              E-mail *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email || ""}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none transition ${
                errors.email
                  ? "border-[#F2A2A9] focus:border-[#F2A2A9]"
                  : "border-[#F2F2F2] focus:border-[#635EF2]"
              }`}
              placeholder="email@exemplo.com"
              disabled={isLoading}
            />
            {errors.email && (
              <p className="text-sm text-[#F2A2A9] mt-1">{errors.email}</p>
            )}
          </div>

          {/* CPF */}
          <div>
            <label className="block text-sm font-medium text-[#414059] mb-2">
              CPF *
            </label>
            <input
              type="text"
              name="cpf"
              value={formData.cpf || ""}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none transition ${
                errors.cpf
                  ? "border-[#F2A2A9] focus:border-[#F2A2A9]"
                  : "border-[#F2F2F2] focus:border-[#635EF2]"
              }`}
              placeholder="000.000.000-00"
              disabled={isLoading}
            />
            {errors.cpf && (
              <p className="text-sm text-[#F2A2A9] mt-1">{errors.cpf}</p>
            )}
          </div>

          {/* Data de Nascimento */}
          <div>
            <label className="block text-sm font-medium text-[#414059] mb-2">
              Data de Nascimento *
            </label>
            <input
              type="date"
              name="dataNascimento"
              value={formData.dataNascimento || ""}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none transition ${
                errors.dataNascimento
                  ? "border-[#F2A2A9] focus:border-[#F2A2A9]"
                  : "border-[#F2F2F2] focus:border-[#635EF2]"
              }`}
              disabled={isLoading}
            />
            {errors.dataNascimento && (
              <p className="text-sm text-[#F2A2A9] mt-1">{errors.dataNascimento}</p>
            )}
          </div>

          {/* Telefone */}
          <div>
            <label className="block text-sm font-medium text-[#414059] mb-2">
              Telefone
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="tel"
                value={telefoneInput}
                onChange={(e) => setTelefoneInput(e.target.value)}
                className="flex-1 px-4 py-2 border border-[#F2F2F2] rounded-lg focus:outline-none focus:border-[#635EF2] transition"
                placeholder="(11) 99999-9999"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={handleAddPhone}
                className="px-4 py-2 bg-[#635EF2] text-white rounded-lg hover:bg-[#4F46E5] transition disabled:opacity-50"
                disabled={isLoading || !telefoneInput.trim()}
              >
                +
              </button>
            </div>
            {formData.telefone.length > 0 && (
              <div className="space-y-2">
                {formData.telefone.map((tel, index) => (
                  <div key={index} className="flex items-center justify-between bg-[#F8F8FA] p-2 rounded-lg">
                    <span className="text-sm text-[#414059]">{tel}</span>
                    <button
                      type="button"
                      onClick={() => handleRemovePhone(index)}
                      className="text-[#F2A2A9] hover:text-[#E88B95] transition"
                      disabled={isLoading}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Botões */}
          <div className="flex gap-3 pt-4 border-t border-[#F2F2F2]">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-[#635EF2] text-white rounded-lg hover:bg-[#4F46E5] transition disabled:opacity-50 font-medium"
            >
              {isLoading ? "Salvando..." : "Atualizar"}
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
