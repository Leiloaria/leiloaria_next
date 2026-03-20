"use client";

import Image from "next/image";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

type Metodo = "PIX" | "CREDITO";

export default function ConfirmacaoPagamentoPage() {
    const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const searchParams = useSearchParams();

  const tipo = searchParams.get("tipo") as Metodo;
  const pixUrl = searchParams.get("chavePix");

  const [metodo, setMetodo] = useState<Metodo>(tipo?? "PIX");
  const [progress, setProgress] = useState(0);

  const handleConfirmacao = async () => {
    try{
        const response = await fetch(`/api/client/pagamento/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
        });
        if (response.ok) {
            router.push(`/client/pagamento/confirmacao/`);
        } else {
            const error = await response.json();
            alert(error.message || "Erro ao criar lance");
        }
    }
    catch (e) {
      alert("Erro ao confirmar pagamento");
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 2;

        if (next === 90) {
          handleConfirmacao();
          clearInterval(interval);
          return 90;
        }

        return next;
      });
    }, 200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-lg mx-auto p-8 bg-white rounded-lg shadow-md">
      {metodo === "PIX" && (
        <div className="flex flex-col items-center gap-4 mb-6">
          <div className="bg-white p-4">
            <Image
                src="/qr-code.png"
                alt="Qr code do pix"
                width={200}
                height={200}
            /> 
          </div>

          <p className="text-gray-600">Escaneie o QR Code para finalizar o pagamento</p>
          <p className="text-gray-600">Ou copie a chave: </p>
          <p className="text-gray-600 text-center">{pixUrl}</p>

        </div>
      )}

      {metodo === "CREDITO" && (
        <div className="text-center mb-6 flex flex-col justify-center items-center gap-6">
            <Image
                src="/credit-card.png"
                alt="Cartão de crédito"
                width={200}
                height={200}
                className="float-animation"
            />  
          <p className="text-gray-600 font-semibold">
            Processando pagamento no cartão...
          </p>
        </div>
      )}

      <div className="w-full bg-gray-200 rounded h-4 overflow-hidden mb-4">
        <div
          className="bg-purple-600 h-4 transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}