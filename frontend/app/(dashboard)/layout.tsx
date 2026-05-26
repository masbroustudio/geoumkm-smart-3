import Sidebar from "@/components/dashboard/Sidebar";
import FloatingChatPanel from "@/components/chat/FloatingChatPanel";
import BackToTop from "@/components/ui/BackToTop";
import ToastContainer from "@/components/ui/Toast";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import { ToastProvider } from "@/lib/toast-context";
import PageViewTracker from "@/components/dashboard/PageViewTracker";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // TODO: Wrap with <AuthGuard> when Azure AD B2C is configured.
  // Currently disabled for demo access. To enable authentication:
  // 1. Import AuthGuard from '@/components/ui/AuthGuard'
  // 2. Import AuthProvider from '@/lib/auth-context'
  // 3. Wrap the return JSX with <AuthProvider><AuthGuard>...</AuthGuard></AuthProvider>
  //    or add AuthProvider at the root layout level and AuthGuard here.

  return (
    <ToastProvider>
      <div className="min-h-screen bg-[var(--background)]">
        <PageViewTracker />
        <Sidebar />
        <main className="lg:ml-[260px] min-h-screen p-4 sm:p-6 lg:p-8">
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </main>
        <FloatingChatPanel />
        <BackToTop />
        <ToastContainer />
      </div>
    </ToastProvider>
  );
}
