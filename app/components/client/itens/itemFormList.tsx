"use client";

import ItemCard from "./itemCard";
import { ItemFormData } from "@/lib/auctions/types";

interface ItemFormListProps {
    items: ItemFormData[];
    isLoading: boolean;
    handleRemoveItem: (index: number) => void;
}

export default function ItemFormList({ items, isLoading, handleRemoveItem }: ItemFormListProps) {
    return (
        <>
            {items.length > 0 && (
                <div className="space-y-2">
                    {items.map((item, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between bg-[#F8F8FA] p-3 rounded-lg border border-[#F2F2F2]"
                        >
                            <div className="flex-1">
                                <p className="font-medium text-[#414059]">{item.nome}</p>
                                <p className="text-xs text-[#8B86C4]">
                                    {item.condicao} • Categorias: {item.categoriasId.join(", ")}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => handleRemoveItem(index)}
                                className="ml-4 px-3 py-2 text-[#F2A2A9] hover:bg-[#F2A2A9]/10 rounded-lg transition"
                                disabled={isLoading}
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                </div>
            )}

        </>
    );
}
