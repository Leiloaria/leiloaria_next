"use client";

import React, { useState, useEffect } from "react";
import { CategoriaResponse, CategoriaRequest } from "@/lib/categories/types";
import { CategoryForm, CategoryTable } from "@/app/components/admin/categories";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<CategoriaResponse[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<CategoriaResponse | null>(null);
  const [formMode, setFormMode] = useState<"create" | "edit" | "sub">("create");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/admin/categories");
      if (response.ok) {
        const data = await response.json();
        const list = Array.isArray(data.categories) ? data.categories : [];
        setCategories(list);
      } else {
        setCategories([]);
      }
    } catch (e) {
      setCategories([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenForm = (cat?: CategoriaResponse) => {
    setSelectedCategory(cat || null);
    setFormMode(cat ? "edit" : "create");
    setIsFormOpen(true);
  };

  const handleOpenSubcategoryForm = (cat: CategoriaResponse) => {
    setSelectedCategory(cat);
    setFormMode("sub");
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedCategory(null);
    setFormMode("create");
  };

  const handleSubmit = async (data: CategoriaRequest) => {
    setIsSaving(true);
    try {
      let response;
      if (formMode === "sub" && selectedCategory) {
        response = await fetch(`/api/admin/categories/${selectedCategory.id}/subcategories`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nome: data.nome }),
        });
      } else if (selectedCategory) {
        response = await fetch(`/api/admin/categories/${selectedCategory.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
      } else {
        response = await fetch("/api/admin/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
      }
      if (response.ok) {
        handleCloseForm();
        await fetchCategories();
      } else {
        const error = await response.json();
        alert(error.message || "Erro ao salvar categoria");
      }
    } catch (e) {
      alert("Erro ao salvar categoria");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir esta categoria?")) return;
    try {
      const response = await fetch(`/api/admin/categories/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        await fetchCategories();
      } else {
        const error = await response.json();
        alert(error.message || "Erro ao excluir categoria");
      }
    } catch (e) {
      alert("Erro ao excluir categoria");
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-[#635EF2]">Categorias</h1>
          <button
            onClick={() => handleOpenForm()}
            className="px-4 py-2 bg-[#635EF2] text-white rounded-lg hover:bg-[#4F46E5] transition font-medium"
          >
            + Nova Categoria
          </button>
        </div>
        <p className="text-[#414059]">Gerencie as categorias da plataforma</p>
      </div>
      <div className="bg-white rounded-lg border border-[#F2F2F2] overflow-hidden">
        <CategoryTable
          categories={categories}
          onEdit={handleOpenForm}
          onAddSubcategory={handleOpenSubcategoryForm}
          onDelete={handleDelete}
          isLoading={isLoading}
        />
      </div>
      {isFormOpen && (
        <CategoryForm
          category={formMode === "sub" ? null : selectedCategory}
          title={formMode === "sub" ? "Nova Subcategoria" : undefined}
          onSubmit={handleSubmit}
          onCancel={handleCloseForm}
          isLoading={isSaving}
        />
      )}
    </div>
  );
}
