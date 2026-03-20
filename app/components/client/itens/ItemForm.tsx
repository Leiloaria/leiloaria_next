"use client";

import React, { useState, useEffect } from "react";
import { CategoriaResponse, ItemFormData } from "@/lib/auctions/types";
import { CondicaoItem } from "@/lib/auctions/items";
import Select, { MultiValue } from 'react-select';

interface ItemFormProps {
  item: ItemFormData;
  onItemChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onCategoriesChange: (ids: number[]) => void;
  onAddItem: () => void;
  onCancel: () => void;
  isLoading: boolean;
}

interface CategoriaOption {
  readonly value: string;
  readonly label: string;
}

export default function ItemForm({
  item,
  onItemChange,
  onCategoriesChange,
  onAddItem,
  onCancel,
  isLoading,
}: ItemFormProps) {
  const [categorias, setCategorias] = useState<CategoriaOption[]>([]);
  
  // 1. Fixed the data fetching logic
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`/api/client/categories`);
        if (response.ok) {
          const data = await response.json();
          const options = data.categories.map((cat: CategoriaResponse) => ({
            value: cat.id.toString(),
            label: cat.nome,
          }));
          setCategorias(options);
        }
      } catch (e) {
        console.error("Erro ao buscar categorias", e);
      }
    };
    fetchCategories();
  }, []);

  // 2. Handle the Select change
  const handleSelectChange = (newValue: MultiValue<CategoriaOption>) => {
    const ids = newValue.map(option => parseInt(option.value));
    onCategoriesChange(ids);
  };

  // 3. Derived state to keep the UI in sync with the parent's item.categoriaIds
  const selectedOptions = categorias.filter(option => 
    item.categoriasId?.includes(parseInt(option.value))
  );

  return (
    <div className="bg-[#F8F8FA] rounded-lg p-4 border border-[#F2F2F2]">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-[#414059] mb-2">
            Nome do Item *
          </label>
          <input
            type="text"
            name="nome"
            value={item.nome}
            onChange={onItemChange}
            className="w-full px-3 py-2 border border-[#F2F2F2] rounded-lg focus:outline-none focus:border-[#635EF2] transition"
            placeholder="Nome do item"
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#414059] mb-2">
            Condição *
          </label>
          <select
            name="condicao"
            value={item.condicao}
            onChange={onItemChange}
            className="w-full px-3 py-2 border border-[#F2F2F2] rounded-lg focus:outline-none focus:border-[#635EF2] transition"
            disabled={isLoading}
          >
            <option value={CondicaoItem.NOVO}>Novo</option>
            <option value={CondicaoItem.SEMI_NOVO}>Semi-novo</option>
            <option value={CondicaoItem.USADO}>Usado</option>
            <option value={CondicaoItem.AVARIADO}>Avariado</option>
          </select>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-[#414059] mb-2">
          Descrição
        </label>
        <textarea
          name="descricao"
          value={item.descricao}
          onChange={onItemChange}
          className="w-full px-3 py-2 border border-[#F2F2F2] rounded-lg focus:outline-none focus:border-[#635EF2] transition"
          placeholder="Descrição do item"
          rows={2}
          disabled={isLoading}
        />
      </div>

      {/* 4. Corrected Select Implementation */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-[#414059] mb-2">
          Categorias *
        </label>
        <Select<CategoriaOption, true>
          isMulti
          name="categorias"
          options={categorias}
          value={selectedOptions}
          onChange={handleSelectChange}
          isDisabled={isLoading}
          placeholder="Selecione as categorias..."
          className="basic-multi-select"
          classNamePrefix="select"
          // Custom styles to match your theme
          styles={{
            control: (base) => ({
              ...base,
              borderColor: '#F2F2F2',
              color: '#656565',
              borderRadius: '0.5rem',
              '&:hover': { borderColor: '#635EF2' }
            })
          }}
        />
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2 border border-[#F2F2F2] text-[#414059] rounded-lg hover:bg-[#F2F2F2] transition font-medium"
          disabled={isLoading}
        >
          Cancelar
        </button>
        <button
          type="button"
          onClick={onAddItem}
          className="flex-1 px-4 py-2 bg-[#635EF2] text-white rounded-lg hover:bg-[#4A47B5] transition disabled:opacity-50 font-medium"
          disabled={isLoading}
        >
          Adicionar Item
        </button>
      </div>
    </div>
  );
}