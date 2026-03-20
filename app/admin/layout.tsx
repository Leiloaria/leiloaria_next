"use client";

import Sidebar from "@/app/components/admin/Sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#F2F2F2]">
      <Sidebar />
      <main className="flex-1 md:ml-0">
        {children}
      </main>
    </div>
  );
}
