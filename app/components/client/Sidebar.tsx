"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function ClientSidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  const menuItems = [
    { label: "Todos os Leilões", href: "/client/leiloes" },
    { label: "Meus Leilões", href: "/client/meus-leiloes" },
    { label: "Meus Lances", href: "/client/meus-lances"}
  ];

  return (
    <>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 bg-[#635EF2] text-white p-2 rounded-lg"
        aria-label="Abrir menu"
      >
        ☰
      </button>

      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`fixed md:static top-0 left-0  bg-white border-r border-[#F2F2F2] transition-all duration-300 z-40 min-h-screen ${
          isOpen ? "w-64" : "w-16"
        } overflow-hidden`}
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="hidden md:flex items-center justify-center w-full h-12 border-b border-[#F2F2F2] text-[#635EF2] hover:bg-[#F2F2F2] transition"
          aria-label={isOpen ? "Recolher menu" : "Expandir menu"}
        >
          {isOpen ? <span className="text-xl">«</span> : <span className="text-xl">»</span>}
        </button>

        <nav className={`p-4 space-y-2 ${isOpen ? "" : "px-1"}`}>
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block rounded-lg transition font-medium ${
                isActive(item.href)
                  ? "text-[#635EF2] bg-[#F2F2F2]"
                  : "text-[#414059] hover:text-[#635EF2] hover:bg-[#F2F2F2]"
              } ${isOpen ? "px-4 py-3" : "px-0 py-3 text-center"}`}
              title={item.label}
            >
              {isOpen ? item.label : item.label.charAt(0)}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}
