"use client";

import { AvaliacaoResponse } from "@/lib/auctions/types";


export default function AvaliacaoCard({ avaliacao }: { avaliacao: AvaliacaoResponse }) {

    return (
        <div className="w-full mx-auto max-w-xl flex flex-col  justify-center  relative px-8 py-4">
            <div className="prose text-gray-500 prose-sm prose-headings:font-normal prose-headings:text-xl">
                <div>
                    <h1 className="font-bold">{avaliacao.usuario?.nome}</h1>
                    <p className="text-balance">
                        {avaliacao.comentario}
                    </p>
                </div>
            </div>
            <div className="flex w-full mx-auto mt-3 border-t pt-3 justify-between items-center">
                <div className="flex gap-1 items-center">
                    {[1, 2, 3, 4, 5].map((estrela) => (
                        <span
                            key={estrela}
                            className={`text-2xl leading-none ${estrela <= avaliacao.stars ? "text-yellow-400" : "text-gray-300"
                                }`}
                        >
                            ★
                        </span>
                    ))}
                </div>
                <span className="text-gray-500 text-sm">
                    {avaliacao.stars} de 5 estrelas
                </span>
            </div>
        </div>
    );
}
