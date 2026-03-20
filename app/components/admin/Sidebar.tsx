"use client";

import { useState } from "react";
import Link from "next/link";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);

  const menuItems = [
    { label: "Usuários", href: "/admin/users" },
    { label: "Categorias", href: "/admin/categories" },
    { label: "Leilões", href: "/admin/auctions" },
  ];

  return (
    <>
      {/* Botão toggle mobile */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 bg-[#635EF2] text-white p-2 rounded-lg"
        aria-label="Abrir menu"
      >
        ☰
      </button>

      {/* Overlay mobile */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:static top-0 left-0 h-screen bg-white border-r border-[#F2F2F2] transition-all duration-300 z-40 ${
          isOpen ? "w-64" : "w-16"
        } overflow-hidden`}
      >
        {/* Botão toggle desktop */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="hidden md:flex items-center justify-center w-full h-12 border-b border-[#F2F2F2] text-[#635EF2] hover:bg-[#F2F2F2] transition"
          aria-label={isOpen ? "Recolher menu" : "Expandir menu"}
        >
          {isOpen ? <span className="text-xl">«</span> : <span className="text-xl">»</span>}
        </button>
        {/* Menu items */}
        <nav className={`p-4 space-y-2 ${isOpen ? "" : "px-1"}`}>
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block rounded-lg transition text-[#414059] hover:text-[#635EF2] font-medium ${
                isOpen ? "px-4 py-3 hover:bg-[#F2F2F2]" : "px-0 py-3 text-center"
              }`}
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
