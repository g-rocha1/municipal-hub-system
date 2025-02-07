import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  console.log("ProtectedRoute - Estado atual:", {
    isAuthenticated,
    isLoading,
    userId: user?.id,
    currentPath: location.pathname
  });

  // Se estiver carregando, mostra o spinner
  if (isLoading) {
    console.log("ProtectedRoute - Carregando...");
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Se não estiver autenticado e não estiver carregando, redireciona para login
  if (!isAuthenticated) {
    console.log("ProtectedRoute - Usuário não autenticado, redirecionando para login");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Se estiver autenticado e não estiver carregando, renderiza o conteúdo
  console.log("ProtectedRoute - Usuário autenticado, renderizando conteúdo");
  return <>{children}</>;
}