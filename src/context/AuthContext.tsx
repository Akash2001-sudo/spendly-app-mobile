import { createContext, useState, ReactNode } from 'react';
import { login as loginApi, signup as signupApi } from '../api/auth';
import { setSessionUser } from '../api/session';

interface User {
  _id: string;
  username: string;
  email: string;
  token: string;
}

interface AuthContextType {
  user: User | null;
  login: (userData: any) => Promise<void>;
  signup: (userData: any) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading] = useState(false);

  const login = async (userData: any) => {
    const data = await loginApi(userData);
    setUser(data);
    setSessionUser(data);
  };

  const signup = async (userData: any) => {
    const data = await signupApi(userData);
    setUser(data);
    setSessionUser(data);
  };

  const logout = () => {
    setUser(null);
    setSessionUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
