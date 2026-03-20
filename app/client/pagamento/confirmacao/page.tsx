"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ConfirmacaoPage() {
    const router = useRouter();
    useEffect(() => {
        setTimeout(() => {
            router.push(`/client/meus-lances`);
        }, 3000);
    }, []);

    return (
        <div className="max-w-lg mx-auto p-8 bg-white rounded-lg shadow-md">
            <div className="flex flex-col items-center gap-4 mb-6">
                <Image
                    src="/check.png"
                    alt="Qr code do pix"
                    width={200}
                    height={200}
                    className="float-animation"
                />
                <p className="text-gray-600 font-semibold">
                    Pagamento aprovado com sucesso!
                </p>
            </div>

        </div>
    )
}