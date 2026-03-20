"use client";

import React, { useState, useEffect } from "react";
import { LeilaoFormData, LeilaoResponse } from "@/lib/auctions/types";

interface AuctionFormProps {
  auction?: LeilaoResponse | null;
  onSubmit: (data: LeilaoFormData) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

export default function AuctionForm({
  auction,
  onSubmit,
  onCancel,
  isLoading,
}: AuctionFormProps) {
  const [formData, setFormData] = useState<LeilaoFormData>({
    nome: "",
    inicio: "",
    fim: "",
    prazoPagamento: "",
    lanceMinimo: "",
    descricao: "",
    itens: [],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (auction) {
      setFormData({
        nome: auction?.lote?.nome || "",
        inicio: auction.inicio ? auction.inicio.replace("Z", "") : "",
        fim: auction.fim ? auction.fim.replace("Z", "") : "",
        prazoPagamento: auction.prazoPagamento ? auction.prazoPagamento.replace("Z", "") : "",
        lanceMinimo: String(auction?.lote?.lanceMinimo || ""),
        descricao: auction?.lote?.descricao || "",
        itens: [],
      });
    } else {
      setFormData({
        nome: "",
        inicio: "",
        fim: "",
        prazoPagamento: "",
        lanceMinimo: "",
        descricao: "",
        itens: [],
      });
    }
    setErrors({});
  }, [auction]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.nome.trim() || formData.nome.length < 3) {
      newErrors.nome = "Nome deve ter pelo menos 3 caracteres";
    }

    if (!formData.inicio) {
      newErrors.inicio = "Data/hora de início obrigatória";
    }

    if (!formData.fim) {
      newErrors.fim = "Data/hora de fim obrigatória";
    }

    if (!formData.prazoPagamento) {
      newErrors.prazoPagamento = "Prazo de pagamento obrigatório";
    }

    if (!formData.lanceMinimo || parseFloat(formData.lanceMinimo) <= 0) {
      newErrors.lanceMinimo = "Lance mínimo deve ser maior que 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    await onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold text-[#635EF2] mb-4">
          {auction ? "Editar Leilão" : "Novo Leilão"}
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
              placeholder="Nome do leilão"
              disabled={isLoading}
            />
            {errors.nome && <p className="text-sm text-[#F2A2A9] mt-1">{errors.nome}</p>}
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-sm font-medium text-[#414059] mb-2">
              Descrição
            </label>
            <textarea
              name="descricao"
              value={formData.descricao || ""}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-[#F2F2F2] rounded-lg focus:outline-none focus:border-[#635EF2] transition"
              placeholder="Descrição do leilão"
              rows={3}
              disabled={isLoading}
            />
          </div>

          {/* Lance Mínimo */}
          <div>
            <label className="block text-sm font-medium text-[#414059] mb-2">
              Lance Mínimo *
            </label>
            <input
              type="number"
              name="lanceMinimo"
              value={formData.lanceMinimo || ""}
              onChange={handleChange}
              step="0.01"
              min="0"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none transition ${
                errors.lanceMinimo
                  ? "border-[#F2A2A9] focus:border-[#F2A2A9]"
                  : "border-[#F2F2F2] focus:border-[#635EF2]"
              }`}
              placeholder="0.00"
              disabled={isLoading}
            />
            {errors.lanceMinimo && (
              <p className="text-sm text-[#F2A2A9] mt-1">{errors.lanceMinimo}</p>
            )}
          </div>

          {/* Data/Hora Início */}
          <div>
            <label className="block text-sm font-medium text-[#414059] mb-2">
              Início *
            </label>
            <input
              type="datetime-local"
              name="inicio"
              value={formData.inicio || ""}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none transition ${
                errors.inicio
                  ? "border-[#F2A2A9] focus:border-[#F2A2A9]"
                  : "border-[#F2F2F2] focus:border-[#635EF2]"
              }`}
              disabled={isLoading}
            />
            {errors.inicio && <p className="text-sm text-[#F2A2A9] mt-1">{errors.inicio}</p>}
          </div>

          {/* Data/Hora Fim */}
          <div>
            <label className="block text-sm font-medium text-[#414059] mb-2">
              Fim *
            </label>
            <input
              type="datetime-local"
              name="fim"
              value={formData.fim || ""}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none transition ${
                errors.fim
                  ? "border-[#F2A2A9] focus:border-[#F2A2A9]"
                  : "border-[#F2F2F2] focus:border-[#635EF2]"
              }`}
              disabled={isLoading}
            />
            {errors.fim && <p className="text-sm text-[#F2A2A9] mt-1">{errors.fim}</p>}
          </div>

          {/* Data/Hora Prazo Pagamento */}
          <div>
            <label className="block text-sm font-medium text-[#414059] mb-2">
              Prazo de Pagamento *
            </label>
            <input
              type="datetime-local"
              name="prazoPagamento"
              value={formData.prazoPagamento || ""}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none transition ${
                errors.prazoPagamento
                  ? "border-[#F2A2A9] focus:border-[#F2A2A9]"
                  : "border-[#F2F2F2] focus:border-[#635EF2]"
              }`}
              disabled={isLoading}
            />
            {errors.prazoPagamento && (
              <p className="text-sm text-[#F2A2A9] mt-1">{errors.prazoPagamento}</p>
            )}
          </div>

          {/* Botões */}
          <div className="flex gap-3 pt-4 border-t border-[#F2F2F2]">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-[#635EF2] text-white rounded-lg hover:bg-[#4F46E5] transition disabled:opacity-50 font-medium"
            >
              {isLoading ? "Salvando..." : auction ? "Atualizar" : "Criar"}
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
