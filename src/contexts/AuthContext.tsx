import { createContext, useContext, useState, ReactNode } from "react";
import { api } from "@/services/api";
import { toast } from "sonner";
import { User, UserRole } from "@/services/userService";

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hasPermission: (requiredRole: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
    try {
      console.log('Tentando fazer login com:', { email });
      
      const response = await api.post('/auth/login', { email, password });
      console.log('Resposta do servidor:', response.data);
      
      const { token, user } = response.data;
      
      if (!token) {
        console.error('Token não encontrado na resposta');
        throw new Error('Token não encontrado');
      }
      
      localStorage.setItem('token', token);
      setIsAuthenticated(true);
      setUser(user);
      toast.success('Login realizado com sucesso!');
    } catch (error: any) {
      console.error('Erro durante o login:', error.response?.data || error.message);
      const errorMessage = error.response?.data?.message || 'Erro ao fazer login. Verifique suas credenciais.';
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUser(null);
    toast.success('Logout realizado com sucesso!');
  };

  const hasPermission = (requiredRoles: UserRole[]) => {
    if (!user) return false;
    
    // Master tem acesso a tudo
    if (user.role === 'master') return true;
    
    // Verifica se o papel do usuário está entre os papéis permitidos
    return requiredRoles.includes(user.role);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, hasPermission }}>
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