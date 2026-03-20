"use client";

import { ItemResponse } from "@/lib/auctions/types";
import Image from "next/image";


export default function ItemCard({ item }: { item: ItemResponse }) {

    return (
        <div
            key={item.id}
            className="card bg-white rounded-lg shadow-md hover:shadow-lg transition  border border-[#F2F2F2] mb-4"
            style={{ "color": "#414059" }}
        >
            <Image
                src={"/no-image.jpg"}
                alt={item.nome}
                width={400}
                height={300}
                className="card-image rounded-t-lg object-cover w-full h-48"
            />

            <div className="card-body p-4" >
                <h3 className="text-lg font-bold text-[#414059] flex-1 line-clamp-2 mb-2">
                    {item.nome}
                </h3>
                
                <p className="text-xs text-[#656565] mb-1">
                    Condição: {item.condicao}
                </p>
                <p className="text-xs text-[#656565] mb-1">
                    Categorias: {item.categorias?.map((cat) => cat.nome).join(", ") || "Nenhuma"}
                </p>
                <hr className="my-3 border-[#F2F2F2]" />
                <p className="card-text text-sm text-[#656565] mb-3 line-clamp-2">
                    {item.descricao?.trim() || "Sem descrição"}
                </p>
            </div>
        </div>
    );
}
