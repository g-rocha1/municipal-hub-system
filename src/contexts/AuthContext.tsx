import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { User, UserRole, UserPermission } from "@/services/userService";

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, senha: string) => Promise<void>;
  logout: () => Promise<void>;
  hasPermission: (permission: UserPermission) => boolean;
  hasRole: (requiredRole: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    console.log("AuthProvider: Checking initial session");
    
    // Verificar sessão atual
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("AuthProvider: Initial session check result:", session);
      if (session) {
        setIsAuthenticated(true);
        fetchUserProfile(session.user.id);
      }
    });

    // Escutar mudanças na autenticação
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("AuthProvider: Auth state changed:", event, session);
      
      if (event === "SIGNED_IN" && session) {
        setIsAuthenticated(true);
        await fetchUserProfile(session.user.id);
      } else if (event === "SIGNED_OUT") {
        setIsAuthenticated(false);
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      console.log("AuthProvider: Fetching user profile for:", userId);
      
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("AuthProvider: Error fetching profile:", error);
        throw error;
      }
      
      if (data) {
        console.log("AuthProvider: Profile fetched successfully:", data);
        setUser(data as User);
      }
    } catch (error) {
      console.error("AuthProvider: Error in fetchUserProfile:", error);
      toast.error("Erro ao carregar perfil do usuário");
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  const login = async (email: string, senha: string) => {
    try {
      console.log("AuthProvider: Attempting login for:", email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: senha,
      });

      if (error) {
        console.error("AuthProvider: Login error:", error);
        throw error;
      }

      if (data.user) {
        console.log("AuthProvider: Login successful:", data.user);
        await fetchUserProfile(data.user.id);
        toast.success("Login realizado com sucesso!");
      }
    } catch (error: any) {
      console.error("AuthProvider: Error during login:", error);
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
      console.log("AuthProvider: Attempting logout");
      
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setIsAuthenticated(false);
      setUser(null);
      toast.success("Logout realizado com sucesso!");
    } catch (error: any) {
      console.error("AuthProvider: Error during logout:", error);
      toast.error(error.message || "Erro ao fazer logout");
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