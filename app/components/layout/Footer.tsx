"use client";

import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  
  // Não renderiza o footer em páginas de autenticação
  if (pathname.startsWith("/auth")) {
    return null;
  }

  return (
    <footer className="bg-[#F8F8FA] text-[#414059] py-8 border-t border-[#F2F2F2]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-[#635EF2] font-bold mb-4">Leiloaria</h3>
            <p className="text-sm text-[#414059]">Sua oferta a um click</p>
          </div>
          <div>
            <h4 className="text-[#635EF2] font-semibold mb-4">Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-[#F2A2A9] transition">Sobre</a></li>
              <li><a href="#" className="hover:text-[#F2A2A9] transition">Contato</a></li>
              <li><a href="#" className="hover:text-[#F2A2A9] transition">Termos</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[#635EF2] font-semibold mb-4">Suporte</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-[#F2A2A9] transition">Ajuda</a></li>
              <li><a href="#" className="hover:text-[#F2A2A9] transition">FAQ</a></li>
              <li><a href="#" className="hover:text-[#F2A2A9] transition">Contato</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-[#F2F2F2] pt-8 text-center text-sm text-[#414059]">
          <p>&copy; 2026 Leiloaria. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
