import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

export function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="fixed top-0 right-0 left-16 z-50 h-14 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center justify-end px-4">
        <div className="flex items-center space-x-2">
          {user && (
            <>
              <span className="text-sm text-muted-foreground">
                {user.nome} ({user.role})
              </span>
              <Button variant="ghost" size="sm" onClick={logout}>
                Sair
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}