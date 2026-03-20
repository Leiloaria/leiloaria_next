"use client";

import { AvaliacaoResponse } from "@/lib/auctions/types";
import AvaliacaoCard from "./avaliacaoCard";
import { AvaliacaoRequest } from "@/lib/auctions/types";
import AvaliacaoForm from "./avaliacaoForm";


interface AvaliacaoProps {
    avaliacoes: AvaliacaoResponse[];
}

export default function AvaliacaoList({
    avaliacoes
}: AvaliacaoProps) {
    return (
        <div
            className="card bg-white rounded-lg shadow-md hover:shadow-lg transition  border border-[#F2F2F2] mb-4 p-8"
            style={{ "color": "#414059" }}>

            <h2 className="text-2xl font-bold text-[#656565] mb-6 text-center">
                Avaliações
            </h2>
            {avaliacoes.length !== 0 &&
                <>
                    {avaliacoes.map((avaliacao) => (
                        <AvaliacaoCard key={"review-" + avaliacao.id} avaliacao={avaliacao} />

                    ))}
                </>
            }

            {avaliacoes.length === 0 &&
                <>
                    <div className="flex w-full mx-auto mt-3 border-t pt-3 justify-center">
                        <p className="text-center ">
                            Leilão sem avaliações.
                        </p>
                    </div>
                </>
            }

        </div>
    );
}
