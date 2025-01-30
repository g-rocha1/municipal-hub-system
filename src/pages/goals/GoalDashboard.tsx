import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  LineChart,
  Line,
} from "recharts";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, CheckCircle, TrendingDown, TrendingUp } from "lucide-react";

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

const GoalDashboard = () => {
  const { data: goals = [], isLoading } = useQuery({
    queryKey: ["goals"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("goals")
        .select("*, goal_tasks(*)")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-[250px]" />
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-[300px]" />
          <Skeleton className="h-[300px]" />
        </div>
        <Skeleton className="h-[400px]" />
      </div>
    );
  }

  const goalsByType = goals.reduce((acc: Record<string, number>, goal) => {
    acc[goal.goal_type] = (acc[goal.goal_type] || 0) + 1;
    return acc;
  }, {});

  const pieChartData = Object.entries(goalsByType).map(([type, count]) => ({
    name: GOAL_TYPE_LABELS[type],
    value: count,
  }));

  const progressData = goals.map((goal) => ({
    name: goal.description,
    progresso: (goal.current_amount / goal.target_amount) * 100,
    meta: goal.target_amount,
    atual: goal.current_amount,
    tipo: GOAL_TYPE_LABELS[goal.goal_type],
  }));

  const deviationData = goals.map((goal) => {
    const deviation = ((goal.current_amount - goal.target_amount) / goal.target_amount) * 100;
    return {
      name: goal.description,
      desvio: deviation,
      tipo: GOAL_TYPE_LABELS[goal.goal_type],
    };
  });

  const averageProgress = progressData.reduce((sum, item) => sum + item.progresso, 0) / progressData.length;
  const goalsAtRisk = deviationData.filter((item) => item.desvio < -20).length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Painel de Metas</h2>
        <p className="text-muted-foreground">
          Análise detalhada do progresso e desvios das metas
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progresso Médio</CardTitle>
            {averageProgress >= 70 ? (
              <TrendingUp className="text-green-500" />
            ) : (
              <TrendingDown className="text-yellow-500" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageProgress.toFixed(1)}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Metas</CardTitle>
            <CheckCircle className="text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{goals.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Metas em Risco</CardTitle>
            <AlertTriangle className="text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{goalsAtRisk}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Tipo</CardTitle>
            <CardDescription>Quantidade de metas por categoria</CardDescription>
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
            <CardTitle>Análise de Desvios</CardTitle>
            <CardDescription>Desvio percentual em relação à meta</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={deviationData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar
                    dataKey="desvio"
                    fill="#3b82f6"
                    name="Desvio (%)"
                    label={{ position: "top" }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Progresso Detalhado</CardTitle>
          <CardDescription>Acompanhamento do progresso de cada meta</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {progressData.map((goal, index) => {
              const deviation = ((goal.atual - goal.meta) / goal.meta) * 100;
              const isAtRisk = deviation < -20;

              return (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{goal.name}</h4>
                      <Badge variant="outline">{goal.tipo}</Badge>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">
                        {formatCurrency(goal.atual)} / {formatCurrency(goal.meta)}
                      </p>
                      <p className="text-sm font-medium">
                        {goal.progresso.toFixed(1)}%
                      </p>
                    </div>
                  </div>

                  <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                    <div
                      className={`h-full ${
                        isAtRisk ? "bg-red-500" : "bg-blue-500"
                      }`}
                      style={{ width: `${Math.min(goal.progresso, 100)}%` }}
                    />
                  </div>

                  {isAtRisk && (
                    <Alert variant="destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle>Meta em Risco</AlertTitle>
                      <AlertDescription>
                        Esta meta está com um desvio significativo de{" "}
                        {deviation.toFixed(1)}% em relação ao planejado.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GoalDashboard;