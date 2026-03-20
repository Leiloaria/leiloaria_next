import ClientSidebar from "@/app/components/client/Sidebar";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F8F8FA] flex items-stretch">
      <ClientSidebar />
      <main className="flex-1 md:ml-0 pt-16 md:pt-0">
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
