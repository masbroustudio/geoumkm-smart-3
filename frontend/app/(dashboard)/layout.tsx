import Sidebar from "@/components/dashboard/Sidebar";
import FloatingChatPanel from "@/components/chat/FloatingChatPanel";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Sidebar />
      <main className="lg:ml-[260px] min-h-screen p-6 lg:p-8">
        {children}
      </main>
      <FloatingChatPanel />
    </div>
  );
}
