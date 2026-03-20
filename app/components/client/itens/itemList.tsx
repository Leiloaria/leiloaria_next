"use client";

import { ItemResponse } from "@/lib/auctions/items";
import ItemCard from "./itemCard";

interface ItemListProps {
  items?: ItemResponse[] | [];
  isLoading: boolean;
}

export default function ItemList({ items = undefined, isLoading }: ItemListProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <p className="text-[#414059]">Carregando itens...</p>
      </div>
    );
  }

  if (items?.length === 0) {
    return (
      <div className="flex justify-center py-12">
        <p className="text-[#414059]">Nenhum item encontrado.</p>
      </div>
    );
  }

  return (
    <div className="p-1 mr-4">
      {items?.map((item) => (
        <ItemCard key={item.id} item={item} />
      ))}
    </div>
  );
}
