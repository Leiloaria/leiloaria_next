
import React from "react";
import LoginForm from "@/app/components/auth/LoginForm";
import Image from "next/image";

export const metadata = {
  title: "Entrar",
  description: "Acesse sua conta",
};

export default function LoginPage() {
  return (
    <div className="relative min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100 px-24 py-12 overflow-hidden">
      <div className="flex flex-1 items-center justify-between w-full h-full z-10">
          <div className="hidden lg:flex flex-col items-center justify-center min-w-[680px] max-w-[780px] w-full gap-6">
            <div className="flex flex-col items-center text-center mb-2">
              <h1 className="text-5xl font-extrabold text-[#6c63ff] drop-shadow-lg mb-2">Leiloaria</h1>
              <p className="text-xl font-medium text-gray-800 drop-shadow-sm">sua oferta a um click</p>
            </div>
            <Image
              src="/background.svg"
              alt="Background Illustration"
              width={680}
              height={680}
              className="object-contain opacity-80"
              priority
              aria-hidden="true"
            />
          </div>
        <div className="relative w-full max-w-md z-20">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Bem-vindo de volta</h1>
              <p className="mt-2 text-gray-600">
                Acesse sua conta para continuar
              </p>
            </div>
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}
