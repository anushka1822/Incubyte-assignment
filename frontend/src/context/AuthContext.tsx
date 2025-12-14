import { createContext, useState } from 'react';
import type { ReactNode } from 'react'; // <--- FIX: Explicit type import

// 1. Define the Shape of the Context
interface AuthContextType {
  token: string | null;
  userRole: string | null;
  login: (token: string, role: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

// 2. Create the Context
export const AuthContext = createContext<AuthContextType | null>(null);

// 3. Create the Provider Component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [userRole, setUserRole] = useState<string | null>(localStorage.getItem('userRole'));

  const login = (newToken: string, newRole: string) => {
    // Save to Local Storage (so it survives refresh)
    localStorage.setItem('token', newToken);
    localStorage.setItem('userRole', newRole);
    
    // Update State
    setToken(newToken);
    setUserRole(newRole);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    setToken(null);
    setUserRole(null);
  };

  return (
    <AuthContext.Provider value={{ 
      token, 
      userRole, 
      login, 
      logout, 
      isAuthenticated: !!token 
    }}>
      {children}
    </AuthContext.Provider>
  );
};