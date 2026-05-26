'use client';

import { createContext, useContext, useState, useCallback } from 'react';

// TODO: When Azure AD B2C is configured (NEXT_PUBLIC_AZURE_AD_B2C_CLIENT_ID is set
// and not 'placeholder'), initialize MSAL here using @azure/msal-browser.
// Replace the mock login/logout with MSAL's loginPopup/loginRedirect and logout methods.

interface AuthUser {
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  const login = useCallback(() => {
    // Mock login - sets a demo user.
    // In production, this would trigger MSAL loginRedirect or loginPopup
    // using the B2C policy defined in NEXT_PUBLIC_AZURE_AD_B2C_POLICY_NAME.
    setUser({
      name: 'Demo User',
      email: 'demo@geoumkm.id',
      role: 'admin',
    });
  }, []);

  const logout = useCallback(() => {
    // Mock logout - clears user state.
    // In production, this would call MSAL logout and redirect to B2C sign-out endpoint.
    setUser(null);
  }, []);

  const isAuthenticated = user !== null;

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
