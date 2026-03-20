"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export default function RegisterForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.username.trim()) {
      newErrors.username = "Nome de usuário obrigatório";
    }

    if (!formData.email.trim()) {
      newErrors.email = "E-mail obrigatório";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Formato de e-mail inválido";
    }

    if (!formData.password) {
      newErrors.password = "Senha obrigatória";
    } else if (formData.password.length < 8) {
      newErrors.password = "A senha deve ter pelo menos 8 caracteres";
    }

    if (!formData.passwordConfirm) {
      newErrors.passwordConfirm = "Confirmação de senha obrigatória";
    } else if (formData.password !== formData.passwordConfirm) {
      newErrors.passwordConfirm = "As senhas não coincidem";
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

  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    setGeneralError("");

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setGeneralError(data.message || "Falha no cadastro");
        setIsLoading(false);
        return;
      }

      router.push("/auth/login?registered=true");
    } catch (error) {
      setGeneralError(
        error instanceof Error ? error.message : "Ocorreu um erro"
      );
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-6">
      {generalError && (
        <div className="rounded-lg bg-red-50 p-4 text-red-800 border border-red-200">
          {generalError}
        </div>
      )}

      <div>
        <label
          htmlFor="username"
          className="block text-sm font-medium text-gray-700"
        >
          Nome de usuário
        </label>
        <input
          id="username"
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="João Silva"
          className={`mt-2 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
            errors.username
              ? "border-[#F2A2A9] focus:ring-[#F2A2A9]"
              : "border-[#414059] focus:ring-[#635EF2]"
          }`}
          disabled={isLoading}
        />
        {errors.username && (
          <p className="mt-1 text-sm text-red-600">{errors.username}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          E-mail
        </label>
        <input
          id="email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="seu@email.com"
          className={`mt-2 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
            errors.email
              ? "border-[#F2A2A9] focus:ring-[#F2A2A9]"
              : "border-[#414059] focus:ring-[#635EF2]"
          }`}
          disabled={isLoading}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700"
        >
          Senha
        </label>
        <input
          id="password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="••••••••"
          className={`mt-2 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
            errors.password
              ? "border-[#F2A2A9] focus:ring-[#F2A2A9]"
              : "border-[#414059] focus:ring-[#635EF2]"
          }`}
          disabled={isLoading}
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          A senha deve ter pelo menos 8 caracteres
        </p>
      </div>

      <div>
        <label
          htmlFor="passwordConfirm"
          className="block text-sm font-medium text-gray-700"
        >
          Confirmar senha
        </label>
        <input
          id="passwordConfirm"
          type="password"
          name="passwordConfirm"
          value={formData.passwordConfirm}
          onChange={handleChange}
          placeholder="••••••••"
          className={`mt-2 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
            errors.passwordConfirm
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:ring-[#02A676]"
          }`}
          disabled={isLoading}
        />
        {errors.passwordConfirm && (
          <p className="mt-1 text-sm text-red-600">{errors.passwordConfirm}</p>
        )}
      </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2 px-4 bg-[#635EF2] text-white font-medium rounded-lg hover:bg-[#F2A2A9] focus:outline-none focus:ring-2 focus:ring-[#635EF2] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
        {isLoading ? "Criando conta..." : "Cadastrar"}
      </button>

      <p className="text-center text-sm text-gray-600">
        Já tem uma conta?{" "}
        <Link
          href="/auth/login"
          className="font-medium text-[#635EF2] hover:text-[#F2A2A9]"
        >
          Entrar
        </Link>
      </p>
    </form>
  );
}
