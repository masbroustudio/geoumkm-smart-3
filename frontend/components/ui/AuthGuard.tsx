'use client';

import { useAuth } from '@/lib/auth-context';

// AuthGuard: Wraps protected sections of the app.
// When real Azure AD B2C is configured, this component will redirect
// unauthenticated users to the B2C login page instead of showing
// the inline login card below. Replace the login() call with
// MSAL's loginRedirect() pointing to the B2C sign-in policy.

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, login } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-8 max-w-md w-full text-center shadow-lg">
          <h2 className="text-xl font-semibold text-[var(--foreground)] mb-4">
            Authentication Required
          </h2>
          <p className="text-[var(--muted-foreground)] mb-6">
            Please log in to access this section.
          </p>
          <button
            onClick={login}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
