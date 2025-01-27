import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/contexts/AuthContext";
import { NavLink, useLocation } from "react-router-dom";
import { UserPermission } from "@/services/userService";
import {
  Users,
  LayoutDashboard,
  MessageSquare,
  Target,
  Bell,
  Settings,
  Building2,
  GraduationCap,
  Heart,
  Leaf,
  DollarSign,
  HardHat,
  Stethoscope,
  FileText,
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: Users, label: "Usuários", path: "/users", permission: "viewUsers" as UserPermission },
  { icon: MessageSquare, label: "Mensagens", path: "/messages" },
  { icon: Target, label: "Metas", path: "/goals" },
  { icon: Bell, label: "Notificações", path: "/notifications" },
  { icon: Building2, label: "Administração", path: "/admin" },
  { icon: GraduationCap, label: "Educação", path: "/education" },
  { icon: Heart, label: "Desenvolvimento Social", path: "/social" },
  { icon: Leaf, label: "Meio Ambiente", path: "/environment" },
  { icon: DollarSign, label: "Finanças", path: "/finance" },
  { icon: HardHat, label: "Infraestrutura", path: "/infrastructure" },
  { icon: Stethoscope, label: "Saúde", path: "/health" },
  { icon: FileText, label: "Documentos", path: "/documents" },
  { icon: Settings, label: "Configurações", path: "/settings" },
];

export function Sidebar({ className }: SidebarProps) {
  const { hasPermission } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className={cn("h-screen w-16 border-r bg-background fixed left-0 top-0", className)}>
      <ScrollArea className="h-full py-4">
        <div className="space-y-2 px-2">
          {menuItems.map((item) => {
            if (item.permission && !hasPermission(item.permission)) {
              return null;
            }

            return (
              <Tooltip key={item.path} delayDuration={0}>
                <TooltipTrigger asChild>
                  <NavLink to={item.path}>
                    <Button
                      variant={isActive(item.path) ? "secondary" : "ghost"}
                      size="icon"
                      className="w-full h-10"
                    >
                      <item.icon className="h-5 w-5" />
                      <span className="sr-only">{item.label}</span>
                    </Button>
                  </NavLink>
                </TooltipTrigger>
                <TooltipContent side="right" className="font-medium">
                  {item.label}
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}