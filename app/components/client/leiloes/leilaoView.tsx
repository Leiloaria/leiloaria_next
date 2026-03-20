"use client";


import { useState, useEffect, use, useMemo } from "react";
import { AvaliacaoRequest, AvaliacaoResponse, LeilaoResponse, StatusLeilao } from "@/lib/auctions/types";
import { CondicaoItem } from "@/lib/auctions/items";
import ItemList from "@/app/components/client/itens/itemList";
import LanceForm from "@/app/components/client/lances/LanceForm";
import { LanceFormData } from "@/lib/lances/types";
import { User } from "@/lib/auth";
import AvaliacaoList from "../avaliacoes/avaliacaoList";
import AvaliacaoForm from "../avaliacoes/avaliacaoForm";
import Image from "next/image";

interface LeilaoViewProps {
    onSubmitLance?: (data: LanceFormData) => Promise<void>;
    isLoading: boolean;
    leilao: LeilaoResponse;
}

export default function LeilaoView({
    onSubmitLance,
    isLoading,
    leilao
}: LeilaoViewProps) {

    const avaliacaoDefault = { stars: 5, comentario: "", loteId: leilao.lote.id, id: 0 };

    const [lanceMinimo, setLanceMinimo] = useState(0);
    const [timeRemaining, setTimeRemaining] = useState<string>("-------");
    const [avaliacao, setAvaliacao] = useState<AvaliacaoRequest>(avaliacaoDefault);
    const [avaliacoes, setAvaliacoes] = useState<AvaliacaoResponse[]>([]);
    const [authUser, setAuthUser] = useState<User | null>(null);
    const [isOwner, setIsOwner] = useState(false);
    const [isWinner, setIsWinner] = useState(false);

    const fetchAvaliacoes = async (loteId: number) => {
        try {
            const response = await fetch(`/api/client/avaliacoes/lote/${loteId}`);
            if (response.ok) {
                const data = await response.json();
                const list = Array.isArray(data) ? data : [];
                setAvaliacoes(list);
                if (list.length > 0) {
                    const avaliacaoUsuario = list.find((avaliacao: any) => authUser && avaliacao.usuario && avaliacao.usuario.id === Number(authUser.id));
                    if (avaliacaoUsuario) {
                        setAvaliacao(avaliacaoUsuario);
                    }
                }
            } else {
                setAvaliacoes([]);
            }
        } catch (e) {
            setAvaliacoes([]);
        }
    };

    const formatTelefone = (telefone: string): string => {
        return `(${telefone.slice(0, 2)}) ${telefone.slice(2, 7)}-${telefone.slice(7, 12)}`
    }

    useEffect(() => {
        if (leilao) {
            fetchUser();
        }
    }, [leilao]);

    useEffect(() => {
        fetchAvaliacoes(leilao.lote.id);
    }, [authUser])

    const fetchUser = async () => {
        try {
            const response = await fetch("/api/auth/me");
            if (response.ok) {
                const data = await response.json();
                setAuthUser(data);
                setIsOwner(data.id === leilao.proprietario.id);
                setIsWinner(checkIfWinner(leilao, data));
            } else {
                setAuthUser(null);
            }
        } catch (e) {
            setAuthUser(null);
        }
    }

    const checkIfWinner = (leilao: LeilaoResponse, usuario: User | null): boolean => {
        if (!usuario || !leilao?.lote?.lances?.length) return false;

        const statusValidos: StatusLeilao[] = [StatusLeilao.AGUARDANDO_PAGAMENTO, StatusLeilao.FINALIZADO];
        if (!statusValidos.includes(leilao.status as StatusLeilao)) return false;

        try {
            const maiorLance = leilao.lote.lances.reduce((vencedor, atual) => {
                return (atual.valor > vencedor.valor) ? atual : vencedor;
            });

            return Number(maiorLance.usuarioId) === Number(usuario.id);
        } catch (error) {
            console.error("Erro ao calcular vencedor:", error);
            return false;
        }
    };

    const calculateTimeRemaining = () => {
        if (!leilao?.fim) return "N/A";
        const now = new Date();
        const end = new Date(leilao.fim);
        const diff = end.getTime() - now.getTime();

        if (diff <= 0) return "Leilão encerrado";
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);

        return `${days}d ${hours}h ${minutes}m ${seconds}s restantes`;
    }

    useEffect(() => {
        let lances = leilao?.lote?.lances || [];
        let maiorLance = lances.reduce((max: number, lance: any) => {
            return lance.valor > max ? lance.valor : max;
        }, 0);

        setLanceMinimo(
            maiorLance > 0 ? maiorLance : leilao?.lote?.lanceMinimo || 0
        );

        if (leilao && leilao.status === StatusLeilao.ABERTO) {
            const interval = setInterval(() => {
                setTimeRemaining(calculateTimeRemaining());
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [leilao]);

    const getStatusBadgeColor = (status: StatusLeilao) => {
        switch (status) {
            case StatusLeilao.ABERTO:
                return "text-[#2E7D32]";
            case StatusLeilao.FINALIZADO:
                return "text-[#6A1B9A]";
            case StatusLeilao.CANCELADO:
                return "text-[#C62828]";
            case StatusLeilao.AGUARDANDO_PAGAMENTO:
                return "text-[#F57F17]";
            case StatusLeilao.PENDENTE:
                return "text-[#1976D2]";
            default:
                return "text-[#414059]";
        }
    };

    const onSubmitAvaliacao = async (data: AvaliacaoRequest) => {
        const action = avaliacao.id !== 0 ? "atualizar" : "criar";
        let url = `/api/client/avaliacoes`
        if (avaliacao.id != 0)
            url += `/${avaliacao.id}`
        try {
            const response = await fetch(url, {
                method: (avaliacao.id != 0) ? "PATCH" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (response.ok) {
                alert(`Êxito ao ${action} avaliação`);
                const review = await response.json();
                if (review) {
                    setAvaliacao(review);
                    fetchAvaliacoes(leilao.lote.id)
                }
            } else {
                const error = await response.json();
                alert(error.message || `Erro ao ${action} avaliação`);

            }
        } catch (e) {
            console.error(`[Avaliacao_${action.toUpperCase()}_ERROR]:`, {
                message: e instanceof Error ? e.message : "Erro desconhecido",
                stack: e instanceof Error ? e.stack : null,
                data: avaliacao
            });

            alert(`Erro ao ${action} avaliação`);
        }
    };

    const onDeleteAvaliacao = async () => {
        try {
            const response = await fetch(`/api/client/avaliacoes/${avaliacao?.id}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
            });
            if (response.status == 204) {
                alert("Avaliação excluida com sucesso");
                setAvaliacao(avaliacaoDefault);
                fetchAvaliacoes(leilao.lote.id);
            } else {
                const error = await response.json();
                alert(error.message || "Erro ao criar Avaliação");
            }
        } catch (e) {
            alert("Erro ao exclir Avaliação");
        }
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 justify-between p-4 bg-white rounded shadow strength pt-8 min-h-screen">
            <div className="bg-white rounded-lg shadow-lg p-6 border border-[#F2F2F2] col-span-2">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-[#635EF2] mb-6">{leilao?.lote?.nome}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4" style={{ color: "#656565" }}>

                        {/* Lance Mínimo */}
                        <div>
                            <label className="block text-sm font-medium text-[#414059] mb-2">
                                Lance Mínimo:
                            </label>
                            <p className="w-full px-3 py-2 border border-[#F2F2F2] rounded-lg focus:outline-none focus:border-[#635EF2] transition">
                                R$ {leilao?.lote?.lanceMinimo && leilao?.lote?.lanceMinimo.toFixed(2)}
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[#414059] mb-2">
                                Último Lance:
                            </label>
                            <p className="w-full px-3 py-2 border border-[#F2F2F2] rounded-lg focus:outline-none focus:border-[#635EF2] transition">
                                R$ {lanceMinimo}
                            </p>
                        </div>

                        {/* Prazo de Pagamento */}
                        <div className="mb-2 col-span-2">
                            <label className="block text-sm font-medium text-[#414059] mb-2">
                                Prazo de Pagamento:
                            </label>
                            <p className="w-full px-3 py-2 border border-[#F2F2F2] rounded-lg focus:outline-none focus:border-[#635EF2] transition">
                                {leilao?.prazoPagamento ? new Date(leilao.prazoPagamento).toLocaleString() : "N/A"}
                            </p>
                        </div>

                        {/* Status */}
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-[#414059] mb-2 ">
                                Status:
                            </label>
                            <p className={`w-full px-3 py-2 border border-[#F2F2F2] rounded-lg focus:outline-none focus:border-[#635EF2] transition text-2xl font-bold text-center ${getStatusBadgeColor(leilao?.status as StatusLeilao)}`} >
                                {leilao?.status || "N/A"}
                            </p>
                        </div>

                        {/* Tempo Restante */}
                        {leilao?.status === StatusLeilao.ABERTO && (
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-[#414059] mb-2 ">
                                    Tempo Restante:
                                </label>
                                <p className="w-full px-3 py-2 border border-[#F2F2F2] rounded-lg focus:outline-none focus:border-[#635EF2] transition text-2xl font-bold text-[#635EF2] text-center">
                                    {timeRemaining}
                                </p>
                            </div>
                        )}

                        {/* Descrição */}
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-[#414059] mb-2">
                                Descrição
                            </label>
                            <p className="w-full px-3 py-4 border border-[#F2F2F2] rounded-lg focus:outline-none focus:border-[#635EF2] transition">
                                {leilao?.lote?.descricao || "N/A"}
                            </p>
                        </div>
                        {leilao.proprietario && (
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-[#414059] mb-2">
                                    Vendedor:
                                </label>
                                <div className="w-full px-3 py-4 border border-[#F2F2F2] rounded-lg focus:outline-none focus:border-[#635EF2] transition">
                                    <div className="bg-white px-3 flex items-center">
                                        <Image
                                            src={"/avatar.png"}
                                            alt={leilao.proprietario.nome}
                                            width={400}
                                            height={300}
                                            className="h-12 w-12 rounded-full border-2 border-gray-600"
                                        />
                                        <div className="ml-4 flex-1 py-4">
                                            <div className="flex items-bottom justify-between mb-1">
                                                <p className="text-grey-darkest">
                                                    {leilao.proprietario.nome}
                                                </p>
                                            </div>
                                            <hr></hr>
                                            <div className="text-grey-dark mt-1 text-sm">
                                                <p>
                                                    Email: {leilao.proprietario.email}
                                                </p>
                                                <div>
                                                    {leilao.proprietario.telefone.map((telefone, index) => (
                                                        <p key={"tel"+index}>Telefone {index + 1}: {formatTelefone(telefone)}</p>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    {leilao?.status === StatusLeilao.ABERTO && !isOwner && (
                        <LanceForm onSubmit={onSubmitLance} lanceMinimo={(lanceMinimo + 10)} loteId={leilao?.lote?.id || ""} isLoading={isLoading} />
                    )}
                </div>
                {isWinner && (
                    <AvaliacaoForm avaliacao={avaliacao} setAvaliacao={setAvaliacao} onSubmit={onSubmitAvaliacao} onDelete={onDeleteAvaliacao} isLoading={isLoading} />
                )
                }
                <AvaliacaoList avaliacoes={avaliacoes} />
            </div>

            {leilao?.lote?.itens && leilao?.lote?.itens?.length > 0 && (
                <div className="ml-6 col-span-1 text-center text-[#635EF2]">
                    <h2 className="text-2xl font-bold text-[#635EF2] mb-6">Itens</h2>
                    <ItemList
                        items={
                            leilao?.lote?.itens?.map(item => ({
                                ...item,
                                condicao: item.condicao
                                    ? (item.condicao as CondicaoItem)
                                    : CondicaoItem.NOVO,
                            }))
                        }
                        isLoading={isLoading}
                    />
                </div>
            )}
        </div>
    );
}
