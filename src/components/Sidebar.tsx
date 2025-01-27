import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/contexts/AuthContext";
import { NavLink, useLocation } from "react-router-dom";
import {
  Users,
  LayoutDashboard,
  MessageSquare,
  Target,
  Bell,
  Settings,
} from "lucide-react";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  const { hasPermission } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className={cn("pb-12", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="space-y-1">
            <NavLink to="/">
              <Button
                variant={isActive("/") ? "secondary" : "ghost"}
                className="w-full justify-start"
              >
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
            </NavLink>
            {hasPermission("viewUsers") && (
              <NavLink to="/users">
                <Button
                  variant={isActive("/users") ? "secondary" : "ghost"}
                  className="w-full justify-start"
                >
                  <Users className="mr-2 h-4 w-4" />
                  Usuários
                </Button>
              </NavLink>
            )}
            <NavLink to="/messages">
              <Button
                variant={isActive("/messages") ? "secondary" : "ghost"}
                className="w-full justify-start"
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Mensagens
              </Button>
            </NavLink>
            <NavLink to="/goals">
              <Button
                variant={isActive("/goals") ? "secondary" : "ghost"}
                className="w-full justify-start"
              >
                <Target className="mr-2 h-4 w-4" />
                Metas
              </Button>
            </NavLink>
            <NavLink to="/notifications">
              <Button
                variant={isActive("/notifications") ? "secondary" : "ghost"}
                className="w-full justify-start"
              >
                <Bell className="mr-2 h-4 w-4" />
                Notificações
              </Button>
            </NavLink>
            <NavLink to="/settings">
              <Button
                variant={isActive("/settings") ? "secondary" : "ghost"}
                className="w-full justify-start"
              >
                <Settings className="mr-2 h-4 w-4" />
                Configurações
              </Button>
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
}