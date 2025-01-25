import { createContext, useContext, useState, ReactNode } from "react";
import { api } from "@/services/api";
import { toast } from "sonner";
import { User } from "@/services/userService";

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const login = async (username: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { username, password });
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      setIsAuthenticated(true);
      setUser(user);
      toast.success('Login realizado com sucesso!');
    } catch (error) {
      toast.error('Erro ao fazer login. Verifique suas credenciais.');
      throw new Error("Credenciais inválidas");
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUser(null);
    toast.success('Logout realizado com sucesso!');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
}