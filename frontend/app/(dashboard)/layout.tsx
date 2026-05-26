import Sidebar from "@/components/dashboard/Sidebar";
import FloatingChatPanel from "@/components/chat/FloatingChatPanel";
import BackToTop from "@/components/ui/BackToTop";
import ToastContainer from "@/components/ui/Toast";
import { ToastProvider } from "@/lib/toast-context";
import PageTransition from "@/components/dashboard/PageTransition";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ToastProvider>
      <div className="min-h-screen bg-[var(--background)]">
        <Sidebar />
        <main className="lg:ml-[260px] min-h-screen p-6 lg:p-8">
          <PageTransition>
            {children}
          </PageTransition>
        </main>
        <FloatingChatPanel />
        <BackToTop />
        <ToastContainer />
      </div>
    </ToastProvider>
  );
}
