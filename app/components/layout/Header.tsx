"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { useUser } from "@/lib/context";

interface LogoutResponse {
  success: boolean;
  message: string;
}

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fecha dropdown quando clica fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      const data: LogoutResponse = await response.json();

      if (data.success) {
        // Redireciona para login
        router.push("/auth/login");
      } else {
        console.error("Logout error:", data.message);
        alert("Erro ao fazer logout");
      }
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Erro ao fazer logout");
    } finally {
      setIsLoading(false);
    }
  };

  // Não renderiza o header em páginas de autenticação
  if (pathname.startsWith("/auth")) {
    return null;
  }

  return (
    <header className="bg-white border-b border-[#F2F2F2] shadow-sm">
      <div className="px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <h1 className="text-2xl font-extrabold text-[#635EF2]">Leiloaria</h1>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-[#635EF2] text-white hover:bg-[#4F48D1] transition"
              title={user?.nome || "Perfil"}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-[#F2F2F2] z-50">
                <div className="px-4 py-3 border-b border-[#F2F2F2]">
                  <p className="text-sm font-medium text-[#414059]">
                    {user?.nome || "Usuário"}
                  </p>
                  <p className="text-xs text-[#9B9BA2]">{user?.email}</p>
                </div>

                <div className="py-2">
                  <button
                    onClick={() => {
                      router.push("/profile");
                      setIsDropdownOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-[#414059] hover:bg-[#F8F8FA] transition"
                  >
                    Perfil
                  </button>
                  <button
                    onClick={() => {
                      router.push("/client/meus-leiloes");
                      setIsDropdownOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-[#414059] hover:bg-[#F8F8FA] transition"
                  >
                    Meus Leilões
                  </button>
                </div>

                <div className="border-t border-[#F2F2F2] py-2">
                  <button
                    onClick={handleLogout}
                    disabled={isLoading}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? "Saindo..." : "Sair"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
