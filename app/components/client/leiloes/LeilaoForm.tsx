"use client";

import React, { useState, useEffect } from "react";
import { LeilaoFormData, ItemFormData, LeilaoResponse, StatusLeilao } from "@/lib/auctions/types";
import { CondicaoItem } from "@/lib/auctions/items";
import ItemForm from "../itens/ItemForm";
import ItemList from "../itens/itemList";
import ItemFormList from "../itens/itemFormList";
import { decodeJwtPayload } from "@/lib/auth/jwt";
import { isAdminByScope } from "@/lib/auth/access";

interface LeilaoFormProps {
  onSubmit?: (data: LeilaoFormData) => Promise<void>;
  onCancel?: (id:number) => void;
  handleClose: () => void;
  isLoading: boolean;
  leilao?: LeilaoResponse;
  viewOnly?: boolean;
  isEditing?: boolean;
}

export default function LeilaoForm({
  onSubmit,
  onCancel,
  isLoading,
  leilao,
  viewOnly = false,
  isEditing = false,
  handleClose,
}: LeilaoFormProps) {
  const [formData, setFormData] = useState<LeilaoFormData>({
    nome: "",
    inicio: "",
    fim: "",
    prazoPagamento: "",
    lanceMinimo: "",
    descricao: "",
    itens: [],
  });

  const [currentItem, setCurrentItem] = useState<ItemFormData>({
    nome: "",
    descricao: "",
    condicao: CondicaoItem.NOVO,
    categoriasId: [],
    imagens: [],
  });

  const [showItemForm, setShowItemForm] = useState(false);

  useEffect(() => {
    if (leilao) {
      setFormData({
        nome: leilao?.lote?.nome || "",
        inicio: leilao.inicio || "",
        fim: leilao.fim || "",
        prazoPagamento: leilao.prazoPagamento || "",
        lanceMinimo: leilao?.lote?.lanceMinimo?.toString() || "",
        descricao: leilao?.lote?.descricao || "",
        itens: leilao?.lote?.itens?.map(item => ({
          idItem: item.id,
          nome: item.nome,
          descricao: item.descricao || "",
          condicao: (item.condicao as CondicaoItem) || CondicaoItem.NOVO,
          categoriasId: item.categorias?.map(cat => cat.id) || [],
          imagens: [],
        })) || [],
      });
    }
  }, [leilao]);


  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddItem = () => {
    setFormData((prev) => ({
      ...prev,
      itens: [...prev.itens, { ...currentItem }],
    }));

    // Reset do formulário de item
    setCurrentItem({
      nome: "",
      descricao: "",
      condicao: CondicaoItem.NOVO,
      categoriasId: [],
      imagens: [],
    });
    setShowItemForm(false);
  };

  const handleRemoveItem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      itens: prev.itens.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (onSubmit)
      await onSubmit(formData);
  };

  const canCancel = (status: StatusLeilao | undefined, proprietaryEmail: string | undefined, tokenJwt: string | null) => {
    const payload = tokenJwt
      ? decodeJwtPayload<{
        sub?: string;
        email?: string;
        scope?: string;
      }>(tokenJwt)
      : null;

    const userEmail = payload?.sub;
    return (status === "PENDENTE" && (userEmail === proprietaryEmail));
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 border border-[#F2F2F2]">
      <h2 className="text-2xl font-bold text-[#635EF2] mb-6">{viewOnly ? formData.nome : isEditing ? "Editar Leilão" : "Novo Leilão"}</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Grid de campos principais - Inline */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Nome */}
          {!viewOnly && (
            <div>
              <label className="block text-sm font-medium text-[#414059] mb-2">
                Nome *
              </label>
              <input
                type="text"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-[#F2F2F2] rounded-lg focus:outline-none focus:border-[#635EF2] transition"
                placeholder="Nome do leilão"
                disabled={isLoading || viewOnly}
              />
            </div>
          )}
          {/* Lance Mínimo */}
          <div>
            <label className="block text-sm font-medium text-[#414059] mb-2">
              Lance Mínimo *
            </label>
            <input
              type="number"
              name="lanceMinimo"
              value={formData.lanceMinimo}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-[#F2F2F2] rounded-lg focus:outline-none focus:border-[#635EF2] transition"
              placeholder="0.00"
              step="0.01"
              min="0"
              disabled={isLoading || viewOnly}
            />
          </div>

          {/* Descrição */}
          <div className={viewOnly ? "md:col-span-2" : ""}>
            <label className="block text-sm font-medium text-[#414059] mb-2">
              Descrição
            </label>
            <textarea
              name="descricao"
              value={formData.descricao}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-[#F2F2F2] rounded-lg focus:outline-none focus:border-[#635EF2] transition"
              placeholder="Descrição do leilão"
              rows={2}
              disabled={isLoading || viewOnly}
            />
          </div>
        </div>

        {/* Grid de datas - Inline */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Início */}
          <div>
            <label className="block text-sm font-medium text-[#414059] mb-2">
              Início *
            </label>
            <input
              type="datetime-local"
              name="inicio"
              value={formData.inicio}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-[#F2F2F2] rounded-lg focus:outline-none focus:border-[#635EF2] transition"
              disabled={isLoading || viewOnly}
            />
          </div>

          {/* Fim */}
          <div>
            <label className="block text-sm font-medium text-[#414059] mb-2">
              Fim *
            </label>
            <input
              type="datetime-local"
              name="fim"
              value={formData.fim}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-[#F2F2F2] rounded-lg focus:outline-none focus:border-[#635EF2] transition"
              disabled={isLoading || viewOnly}
            />
          </div>

          {/* Prazo de Pagamento */}
          <div>
            <label className="block text-sm font-medium text-[#414059] mb-2">
              Prazo de Pagamento *
            </label>
            <input
              type="datetime-local"
              name="prazoPagamento"
              value={formData.prazoPagamento}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-[#F2F2F2] rounded-lg focus:outline-none focus:border-[#635EF2] transition"
              disabled={isLoading || viewOnly}
            />
          </div>
        </div>

        {/* Seção de Itens */}
        {!viewOnly && (
          <>
            <div className="border-t border-[#F2F2F2] pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-[#414059]">
                  Itens ({formData.itens.length})
                </h3>
                <button
                  type="button"
                  onClick={() => setShowItemForm(!showItemForm)}
                  className="px-3 py-2 bg-[#635EF2] text-white text-sm rounded-lg hover:bg-[#4A47B5] transition"
                  disabled={isLoading}
                >
                  {showItemForm ? "Cancelar" : "+ Adicionar Item"}
                </button>
              </div>
              {/* Formulário de Item */}

              {showItemForm && (
                <div className="mb-4">
                  <ItemForm
                    item={currentItem}
                    onItemChange={(e) => setCurrentItem((prev) => ({
                      ...prev,
                      [e.target.name]: e.target.value,
                    }))}
                    onCategoriesChange={(ids) =>
                      setCurrentItem((prev) => ({
                        ...prev,
                        categoriasId: ids,
                      }))
                    }
                    onAddItem={handleAddItem}
                    onCancel={() => setShowItemForm(false)}
                    isLoading={isLoading}
                  />
                </div>
              )}

              {/* Lista de Itens Adicionados */}
              {!viewOnly && (
                <ItemFormList items={formData.itens} isLoading={isLoading} handleRemoveItem={handleRemoveItem} />
              )}
            </div>

            {/* Botões de Ação */}
            <div className="flex gap-3 pt-4 border-t border-[#F2F2F2]">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 px-4 py-2 border border-[#F2F2F2] text-[#414059] rounded-lg hover:bg-[#F8F8FA] transition font-medium"
                disabled={isLoading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-[#635EF2] text-white rounded-lg hover:bg-[#4A47B5] transition disabled:opacity-50 font-medium"
                disabled={isLoading}
              >
                {isLoading ? "Salvando..." : isEditing ? "Atualizar Leilão" : "Criar Leilão"}
              </button>
            </div>

            {
              canCancel(leilao?.status, leilao?.proprietario.email, localStorage.getItem("authToken")) &&
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={()=>{onCancel?.(leilao!.id)}}
                  className="flex-1 px-4 py-2 bg-[#df515d] text-white rounded-lg hover:bg-[#E88B95] transition disabled:opacity-50 font-medium cursor-pointer"
                  disabled={isLoading}
                >
                  Cancelar Leilão
                </button>
              </div>
            }
          </>
        )}
      </form>
    </div>
  );
}
