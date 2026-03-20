"use client";

import React, { useState, useEffect } from "react";
import { LanceFormData } from "@/lib/lances/types";

interface LeilaoFormProps {
    onSubmit?: (data: LanceFormData) => Promise<void>;
    lanceMinimo: number;
    loteId?: number | string;
    isLoading: boolean;
}

export default function LanceForm({
    onSubmit,
    lanceMinimo,
    loteId,
    isLoading
}: LeilaoFormProps) {
    const [formData, setFormData] = useState<LanceFormData>({
        valor: lanceMinimo,
        loteId: "",
    });

    useEffect(() => {
        setFormData((prev) => ({
            ...prev,
            valor: lanceMinimo,
            loteId: loteId ? loteId.toString() : "",
        }));
    }, [lanceMinimo, loteId]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (onSubmit)
            await onSubmit(formData);
    };

    return (
        <div className="bg-white rounded-lg shadow-lg p-6 border border-[#F2F2F2] mt-4">
            <h2 className="text-2xl font-bold text-[#635EF2] mb-6">Lance</h2>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4" style={{ color: "#656565" }}>
                {/* Lance Mínimo */}
                <div>
                    <label className="block text-sm font-medium text-[#414059] mb-2">
                        Valor *
                    </label>
                    <input
                        type="number"
                        name="valor"
                        value={formData.valor}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-[#F2F2F2] rounded-lg focus:outline-none focus:border-[#635EF2] transition"
                        placeholder="0.00"
                        step="0.01"
                        min={lanceMinimo}
                        disabled={isLoading}
                    />
                </div>
                {/* Botões de Ação */}
                <div className="flex pt-6">
                    <button
                        type="submit"
                        className="flex-1 px-4 py-2 bg-[#635EF2] text-white rounded-lg hover:bg-[#4A47B5] transition disabled:opacity-50 font-medium"
                        disabled={isLoading}
                    >
                        {isLoading ? "Salvando..." : "Dar Lance"}
                    </button>
                </div>
            </form>
        </div>
    );
}
