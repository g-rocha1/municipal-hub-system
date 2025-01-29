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
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) throw error;

      if (profile) {
        setUser(profile as User);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      handleSignOut();
    }
  };

  const handleSignOut = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        console.log("Initial session check:", session);

        if (session?.user?.id) {
          await fetchUserProfile(session.user.id);
        } else {
          handleSignOut();
        }
      } catch (error) {
        console.error("Error in initial auth check:", error);
        handleSignOut();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session);

      if (session?.user?.id) {
        await fetchUserProfile(session.user.id);
      } else {
        handleSignOut();
      }
      
      if (event === 'SIGNED_OUT') {
        handleSignOut();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, senha: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: senha,
      });

      if (error) throw error;

      if (!data.user) {
        throw new Error("Usuário não encontrado");
      }

      toast.success("Login realizado com sucesso!");
    } catch (error: any) {
      if (error.message === "Invalid login credentials") {
        toast.error("Email ou senha incorretos");
      } else {
        toast.error(error.message || "Erro ao fazer login");
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      handleSignOut();
      toast.success("Logout realizado com sucesso!");
    } catch (error: any) {
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