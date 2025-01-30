import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Bell, MessageSquare, Target, TrendingUp, TrendingDown } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const GOAL_TYPE_LABELS: Record<string, string> = {
  financeira: "Financeira",
  educacional: "Educacional",
  saude: "Saúde",
  infraestrutura: "Infraestrutura",
  social: "Social",
  ambiental: "Ambiental",
  cultural: "Cultural",
  esporte: "Esporte",
  outros: "Outros",
};

const COLORS = [
  "#3b82f6",
  "#10b981",
  "#ef4444",
  "#f59e0b",
  "#8b5cf6",
  "#06b6d4",
  "#ec4899",
  "#f97316",
  "#6b7280",
];

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: goals = [], isLoading: isLoadingGoals } = useQuery({
    queryKey: ["goals"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("goals")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  const goalsByType = goals.reduce((acc: Record<string, number>, goal) => {
    acc[goal.goal_type] = (acc[goal.goal_type] || 0) + 1;
    return acc;
  }, {});

  const pieChartData = Object.entries(goalsByType).map(([type, count]) => ({
    name: GOAL_TYPE_LABELS[type],
    value: count,
  }));

  const progressData = goals.map(goal => ({
    name: goal.description,
    progress: goal.progress || 0,
    type: GOAL_TYPE_LABELS[goal.goal_type],
  }));

  const getStatusIcon = (progress: number) => {
    if (progress >= 100) return <TrendingUp className="text-green-500" />;
    if (progress < 50) return <TrendingDown className="text-red-500" />;
    return <Target className="text-yellow-500" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">
            Bem-vindo, {user?.nome || "Usuário"}
          </h2>
          <p className="text-muted-foreground">
            Acompanhe o progresso das metas da sua secretaria
          </p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" size="icon">
            <Bell className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <MessageSquare className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Distribuição de Metas por Tipo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={(entry) => entry.name}
                  >
                    {pieChartData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Progresso das Metas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {progressData.slice(0, 5).map((goal, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{goal.name}</p>
                      <p className="text-xs text-muted-foreground">{goal.type}</p>
                    </div>
                    {getStatusIcon(goal.progress)}
                  </div>
                  <Progress value={goal.progress} />
                  <p className="text-xs text-right text-muted-foreground">
                    {Math.round(goal.progress)}%
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Visão Geral do Progresso</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={progressData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="progress" fill="#3b82f6" name="Progresso (%)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;