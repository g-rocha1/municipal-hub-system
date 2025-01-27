import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Sidebar } from "@/components/Sidebar";
import { Menu } from "lucide-react";

export function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0">
            <Sidebar />
          </SheetContent>
        </Sheet>

        <div className="hidden md:block">
          <Sidebar className="border-r" />
        </div>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
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
      </div>
    </header>
  );
}