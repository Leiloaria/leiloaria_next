"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

type MetodoPagamento = "PIX" | "CARTAO";

export default function PagamentoPage() {
  const router = useRouter();
  const params = useParams();
  const idVenda = params.id;

  const [isSaving, setIsSaving] = useState(false);
  const [metodo, setMetodo] = useState<MetodoPagamento>("PIX");

  const [cartao, setCartao] = useState({
    numeroCartao: "",
    nomeTitular: "",
    bandeira: "",
    diaVencimento: "",
    anoVencimento: "",
  });

  const handleCartaoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setCartao({
      ...cartao,
      [e.target.name]: e.target.value,
    });
  };

  const handlePagamento = async () => {
    const payload =
      metodo === "PIX"
        ? { formaPagamento: "PIX" }
        : {
            formaPagamento: "CREDITO",
            ...cartao,
          };

    setIsSaving(true);
    try{
        const response = await fetch(`/api/client/pagamento/${idVenda}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });
        if (response.ok) {
            const data = await response.json();
            router.push(`/client/pagamento/confirmacao/${idVenda}?tipo=${payload.formaPagamento}&chavePix=${data?.metodoPagamento?.chavePix}`);
        } else {
            const error = await response.json();
            alert(error.message || "Erro ao criar lance");
        }
    }
    catch (e) {
      alert("Erro ao criar leilão");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-[#414059] mb-6">
        Finalizar Pagamento
      </h1>

      {/* Seleção método */}
      <div className="space-y-3 mb-6">

        <label className="flex items-center gap-3 border rounded p-3 cursor-pointer text-slate-500">
          <input
            type="radio"
            name="metodo"
            value="PIX"
            checked={metodo === "PIX"}
            onChange={() => setMetodo("PIX")}
          />
          <span>Pix</span>
        </label>

        <label className="flex items-center gap-3 border rounded p-3 cursor-pointer text-slate-500">
          <input
            type="radio"
            name="metodo"
            value="CARTAO"
            checked={metodo === "CARTAO"}
            onChange={() => setMetodo("CARTAO")}
          />
          <span>Cartão de Crédito</span>
        </label>

      </div>

      {/* PIX */}
      {metodo === "PIX" && (
        <div className="p-4 border rounded mb-6 bg-gray-50">
          <p className="text-sm text-gray-600">
            Após confirmar, será gerado um QR Code para pagamento via Pix.
          </p>
        </div>
      )}

      {/* Cartão */}
      {metodo === "CARTAO" && (
        <div className="space-y-4 mb-6">

          <input
            type="text"
            name="numeroCartao"
            placeholder="Número do cartão"
            value={cartao.numeroCartao}
            onChange={handleCartaoChange}
            className="w-full border rounded px-3 py-2"
          />

          <input
            type="text"
            name="nomeTitular"
            placeholder="Nome do titular"
            value={cartao.nomeTitular}
            onChange={handleCartaoChange}
            className="w-full border rounded px-3 py-2"
          />

          <select
            name="bandeira"
            value={cartao.bandeira}
            onChange={handleCartaoChange}
            className="w-full border rounded px-3 py-2"
          >
            <option value="" selected disabled hidden>Selecionar Opção</option>
            <option value="MASTER_CARD">MasterCard</option>
            <option value="VISA">Visa</option>
          </select>

          <div className="flex gap-3">

            <input
              type="number"
              name="diaVencimento"
              placeholder="Dia venc."
              value={cartao.diaVencimento}
              onChange={handleCartaoChange}
              className="w-1/2 border rounded px-3 py-2"
            />

            <input
              type="number"
              name="anoVencimento"
              placeholder="Ano venc."
              value={cartao.anoVencimento}
              onChange={handleCartaoChange}
              className="w-1/2 border rounded px-3 py-2"
            />

          </div>

        </div>
      )}

      {/* Botão */}
      <button
        onClick={handlePagamento}
        className="w-full bg-[#635EF2] text-white py-3 rounded hover:bg-[#4A47B5] transition"
      >
         {isSaving ? "Salvando..." : "Confirmar Pagamento"}
      </button>
    </div>
  );
}