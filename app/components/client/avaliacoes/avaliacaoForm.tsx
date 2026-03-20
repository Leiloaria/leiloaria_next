"use client";

import React from "react";
import { AvaliacaoRequest } from "@/lib/auctions/types";

interface AvaliacaoFormProps {
    avaliacao: AvaliacaoRequest;
    setAvaliacao: (avaliacao: AvaliacaoRequest) => void;
    onSubmit: (data: AvaliacaoRequest) => Promise<void>;
    onDelete: () => Promise<void>;
    isLoading: boolean;
}

export default function AvaliacaoForm({
    avaliacao,
    setAvaliacao,
    onSubmit,
    onDelete,
    isLoading,
}: AvaliacaoFormProps) {

    const updateField = (field: keyof AvaliacaoRequest, value: any) => {
        setAvaliacao({ ...avaliacao, [field]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (onSubmit) {
            await onSubmit(avaliacao);
        }
    };

    const handleDelete = async (e: React.FormEvent) => {
        e.preventDefault();
        await onDelete();
    };

    const currentStars = avaliacao?.stars || 0;

    return (
        <div
            className="card bg-white rounded-lg shadow-md hover:shadow-lg transition  border border-[#F2F2F2] mb-4 p-8"
            style={{ "color": "#414059" }}
        >
            <form
                onSubmit={handleSubmit}
                className="px-4 py-0 mx-auto max-w-4xl sm:p-6 grid grid-cols-1 lg:grid-cols-6 gap-6"
            >
                <div className="lg:col-span-6 col-span-6">
                    <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                        {avaliacao.id == 0 ? "Deixe sua avaliação" : "Edite sua Avaliação"}
                    </h2>
                    <div className="flex justify-start items-center space-x-1 mb-4">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button" // Prevents form submission on click
                                onClick={() => updateField("stars", star)}
                                className={`text-3xl transition-transform hover:scale-125 ${currentStars >= star ? 'text-yellow-400' : 'text-gray-300'
                                    }`}
                            >
                                ★
                            </button>
                        ))}
                    </div>

                    <textarea
                        name="comentario"
                        value={avaliacao?.comentario || ""}
                        onChange={(e) => updateField("comentario", e.target.value)}
                        className="block w-full p-3 text-sm text-gray-900 bg-gray-50 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500 min-h-[120px]"
                        placeholder="Escreva sua avaliação..."
                        required
                    />
                    <div className="flex justify-between">
                        {avaliacao.id !== 0 && (
                            <button
                                type="submit"
                                className="w-full sm:w-auto px-6 py-2 bg-[#f44336] text-white rounded-lg hover:bg-[#e04030] transition disabled:opacity-50 font-medium mt-4"
                                disabled={isLoading}
                                onClick={handleDelete}
                            >
                                {isLoading ? "Excluindo..." : "Excluir"}
                            </button>
                        )}
                        <button
                            type="submit"
                            className="w-full sm:w-auto px-6 py-2 bg-[#635EF2] text-white rounded-lg hover:bg-[#4A47B5] transition disabled:opacity-50 font-medium mt-4"
                            disabled={isLoading}
                        >
                            {isLoading ? "Enviando..." : ((avaliacao.id == 0) ? "Salvar" : "Editar")}
                        </button>
                    </div>

                </div>
            </form>
        </div>
    );
}