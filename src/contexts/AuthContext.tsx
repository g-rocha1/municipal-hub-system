import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { User, UserRole, UserPermission } from "@/services/userService";

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  login: (email: string, senha: string) => Promise<void>;
  logout: () => Promise<void>;
  hasPermission: (permission: UserPermission) => boolean;
  hasRole: (requiredRole: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  const fetchUserProfile = async (userId: string) => {
    try {
      console.log("AuthContext - Buscando perfil do usuário:", userId);
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("AuthContext - Erro ao buscar perfil:", error);
        setUser(null);
        setIsAuthenticated(false);
        setIsLoading(false);
        throw error;
      }

      if (profile) {
        console.log("AuthContext - Perfil encontrado:", profile);
        setUser(profile as User);
        setIsAuthenticated(true);
      } else {
        console.log("AuthContext - Nenhum perfil encontrado");
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("AuthContext - Erro ao buscar perfil:", error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        console.log("AuthContext - Inicializando autenticação");
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user?.id) {
          console.log("AuthContext - Sessão encontrada:", session.user.id);
          await fetchUserProfile(session.user.id);
        } else {
          console.log("AuthContext - Nenhuma sessão encontrada");
          setUser(null);
          setIsAuthenticated(false);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("AuthContext - Erro na inicialização:", error);
        setUser(null);
        setIsAuthenticated(false);
        setIsLoading(false);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("AuthContext - Mudança no estado de autenticação:", event);
      
      if (event === 'SIGNED_IN' && session?.user?.id) {
        console.log("AuthContext - Usuário logado:", session.user.id);
        setIsLoading(true); // Importante: setar loading antes de buscar o perfil
        await fetchUserProfile(session.user.id);
      } else if (event === 'SIGNED_OUT') {
        console.log("AuthContext - Usuário deslogado");
        setUser(null);
        setIsAuthenticated(false);
        setIsLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, senha: string) => {
    try {
      setIsLoading(true);
      console.log("AuthContext - Tentando login:", email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: senha,
      });

      if (error) throw error;

      if (!data.user) {
        throw new Error("Usuário não encontrado");
      }

      console.log("AuthContext - Login bem-sucedido:", data.user.id);
      // Não precisamos chamar fetchUserProfile aqui pois o onAuthStateChange vai cuidar disso
      toast.success("Login realizado com sucesso!");
    } catch (error: any) {
      console.error("AuthContext - Erro no login:", error);
      setIsLoading(false); // Importante: resetar loading em caso de erro
      if (error.message === "Invalid login credentials") {
        toast.error("Email ou senha incorretos");
      } else {
        toast.error(error.message || "Erro ao fazer login");
      }
      throw error;
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      console.log("AuthContext - Iniciando logout");
      await supabase.auth.signOut();
      console.log("AuthContext - Logout realizado com sucesso");
      setUser(null);
      setIsAuthenticated(false);
      toast.success("Logout realizado com sucesso!");
    } catch (error: any) {
      console.error("AuthContext - Erro no logout:", error);
      toast.error(error.message || "Erro ao fazer logout");
    } finally {
      setIsLoading(false);
    }
  };

  const hasPermission = (permission: UserPermission) => {
    if (!user) return false;
    if (user.role === "master") return true;
    return user.permissions?.includes(permission) || false;
  };

  const hasRole = (requiredRoles: UserRole[]) => {
    if (!user) return false;
    if (user.role === "master") return true;
    return requiredRoles.includes(user.role);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        user,
        login,
        logout,
        hasPermission,
        hasRole,
      }}
    >
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