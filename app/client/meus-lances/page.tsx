"use client";

import LanceList from "@/app/components/client/lances/LanceList";
import { MeusLancesResponse } from "@/lib/auctions/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function LancesPage() {
    const router = useRouter();
    const [lances, setLances] = useState<MeusLancesResponse[]>([]);
    const [cancelandoId, setCancelandoId] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchLances = async () => {
        setIsLoading(true);
        try {
            const response = await fetch("/api/client/lances/meus-lances");
            if (response.ok) {
                const data = await response.json();
                const list = Array.isArray(data.bids) ? data.bids : [];
                setLances(list);
            } else {
                setLances([]);
            }
        } catch (e) {
            setLances([]);
        } finally {
            setIsLoading(false);
        }
    };

    const encerrarLeilao = async (id: number) => {
        try {
            setCancelandoId(id);

            const response = await fetch(`/api/client/lances/meus-lances/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Erro ao cancelar lance");
            }

            setLances((prev) => prev.filter((l) => l.id !== id));
        } catch (error) {
            alert("Não foi possível cancelar o lance.");
        } finally {
            setCancelandoId(null);
        }
    };

    const finalizarPagamento = (id: number) => {
        router.push(`/client/pagamento/${id}`);
    }

    const view = (id: number) => {
        router.push(`/client/meus-lances/${id}`);
    }

    useEffect(() => {
        fetchLances();
    }, []);

    return (
        <div>
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-3xl font-bold text-[#414059]">Meus Lances</h1>
            </div>

            <LanceList
                lances={lances}
                isLoading={isLoading}
                cancelandoId={cancelandoId}
                encerrarLeilao={encerrarLeilao}
                finalizarPagamento={finalizarPagamento}
                visualizarLeilao={view} />
        </div>
    );
}