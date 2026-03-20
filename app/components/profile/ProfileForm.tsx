"use client";

import { useState, useEffect } from "react";
import { UserRequest } from "@/lib/auth/types";

interface FormInputProps {
  id: string;
  name: string;
  label: string;
  type?: "text" | "email" | "date" | "tel";
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
}

function FormInput({
  id,
  name,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
}: FormInputProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-[#414059] mb-1"
      >
        {label}
        {required && " *"}
      </label>
      <input
        type={type}
        id={id}
        name={name}
        value={value ?? ""}
        onChange={onChange}
        className="w-full px-4 py-2 border border-[#E0E0E0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#635EF2] focus:border-transparent"
        placeholder={placeholder}
      />
    </div>
  );
}

interface PhoneSectionProps {
  phones: string[];
  onPhoneChange: (index: number, value: string) => void;
  onAddPhone: () => void;
  onRemovePhone: (index: number) => void;
}

function PhoneSection({
  phones,
  onPhoneChange,
  onAddPhone,
  onRemovePhone,
}: PhoneSectionProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-[#414059] mb-3">
        Telefones
      </label>
      <div className="space-y-2">
        {phones?.map((phone, index) => (
          <div key={index} className="flex gap-2">
            <input
              type="tel"
              value={phone}
              onChange={(e) => onPhoneChange(index, e.target.value)}
              className="flex-1 px-4 py-2 border border-[#E0E0E0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#635EF2] focus:border-transparent"
              placeholder="(11) 99999-9999"
            />
            <button
              type="button"
              onClick={() => onRemovePhone(index)}
              className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
            >
              Remover
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={onAddPhone}
        className="mt-2 px-4 py-2 text-sm text-[#635EF2] hover:bg-[#F8F8FA] rounded-lg transition border border-[#E0E0E0]"
      >
        + Adicionar Telefone
      </button>
    </div>
  );
}

interface FormActionsProps {
  isLoading: boolean;
  onCancel: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

function FormActions({
  isLoading,
  onCancel,
  onSubmit,
}: FormActionsProps) {
  return (
    <div className="flex gap-3 pt-4">
      <button
        type="button"
        onClick={onCancel}
        className="flex-1 px-4 py-2 text-[#414059] border border-[#E0E0E0] rounded-lg hover:bg-[#F8F8FA] transition"
      >
        Cancelar
      </button>
      <button
        type="submit"
        disabled={isLoading}
        onClick={onSubmit}
        className="flex-1 px-4 py-2 bg-[#635EF2] text-white rounded-lg hover:bg-[#4F48D1] transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "Salvando..." : "Salvar Alterações"}
      </button>
    </div>
  );
}

interface AlertMessageProps {
  message: string;
  type: "error" | "success";
}

function AlertMessage({ message, type }: AlertMessageProps) {
  if (type === "error") {
    return (
      <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
        {message}
      </div>
    );
  }

  return (
    <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm">
      {message}
    </div>
  );
}

interface ProfileFormProps {
  initialData: UserRequest;
  isLoading: boolean;
  error: string | null;
  success: boolean;
  onSubmit: (data: UserRequest) => Promise<void>;
  onCancel: () => void;
}

// Normaliza dados para garantir strings vazias em vez de null/undefined
function normalizeFormData(data: UserRequest): UserRequest {
  return {
    nome: data.nome ?? "",
    email: data.email ?? "",
    cpf: data.cpf ?? "",
    dataNascimento: data.dataNascimento ?? "",
    telefone: data.telefone ?? [],
  };
}

export function ProfileForm({
  initialData,
  isLoading,
  error,
  success,
  onSubmit,
  onCancel,
}: ProfileFormProps) {
  const [formData, setFormData] = useState<UserRequest>(() =>
    normalizeFormData(initialData)
  );

  useEffect(() => {
    setFormData(normalizeFormData(initialData));
  }, [initialData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePhoneChange = (index: number, value: string) => {
    const newPhones = [...(formData.telefone || [])];
    newPhones[index] = value;
    setFormData((prev) => ({
      ...prev,
      telefone: newPhones,
    }));
  };

  const addPhoneField = () => {
    setFormData((prev) => ({
      ...prev,
      telefone: [...(prev.telefone || []), ""],
    }));
  };

  const removePhoneField = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      telefone: prev.telefone?.filter((_, i) => i !== index) || [],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validações
    if (!formData.nome.trim()) {
      alert("Nome é obrigatório");
      return;
    }

    if (!formData.email.trim()) {
      alert("Email é obrigatório");
      return;
    }

    if (!formData.cpf.trim()) {
      alert("CPF é obrigatório");
      return;
    }

    if (!formData.dataNascimento) {
      alert("Data de nascimento é obrigatória");
      return;
    }

    // Filtrar números de telefone vazios
    const validPhones = formData.telefone?.filter((p) => p.trim()) || [];

    const dataToSubmit = {
      ...formData,
      telefone: validPhones,
    };

    console.log("=== ProfileForm: handleSubmit ===");
    console.log("Dados a enviar:", dataToSubmit);

    await onSubmit(dataToSubmit);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <AlertMessage message={error} type="error" />}

      {success && (
        <AlertMessage
          message="Perfil atualizado com sucesso!"
          type="success"
        />
      )}

      <FormInput
        id="nome"
        name="nome"
        label="Nome Completo"
        value={formData.nome}
        onChange={handleInputChange}
        placeholder="Seu nome completo"
        required
      />

      <FormInput
        id="email"
        name="email"
        label="Email"
        type="email"
        value={formData.email}
        onChange={handleInputChange}
        placeholder="seu.email@example.com"
        required
      />

      <FormInput
        id="cpf"
        name="cpf"
        label="CPF"
        value={formData.cpf}
        onChange={handleInputChange}
        placeholder="000.000.000-00"
        required
      />

      <FormInput
        id="dataNascimento"
        name="dataNascimento"
        label="Data de Nascimento"
        type="date"
        value={formData.dataNascimento}
        onChange={handleInputChange}
        required
      />

      <PhoneSection
        phones={formData.telefone || []}
        onPhoneChange={handlePhoneChange}
        onAddPhone={addPhoneField}
        onRemovePhone={removePhoneField}
      />

      <FormActions
        isLoading={isLoading}
        onCancel={onCancel}
        onSubmit={handleSubmit}
      />
    </form>
  );
}
