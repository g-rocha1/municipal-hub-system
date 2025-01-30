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
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CheckCircle,
  Clock,
  AlertTriangle,
  Loader,
  PauseCircle,
} from "lucide-react";

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

const STATUS_COLORS = {
  pendente: "#f59e0b",
  em_andamento: "#3b82f6",
  concluida: "#10b981",
  atrasada: "#ef4444",
  em_espera: "#6b7280",
};

const STATUS_ICONS = {
  pendente: Clock,
  em_andamento: Loader,
  concluida: CheckCircle,
  atrasada: AlertTriangle,
  em_espera: PauseCircle,
};

const STATUS_LABELS = {
  pendente: "Pendente",
  em_andamento: "Em Andamento",
  concluida: "Concluída",
  atrasada: "Atrasada",
  em_espera: "Em Espera",
};

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
      </div>
    );
  }

  const allTasks = goals.flatMap((goal) => goal.goal_tasks || []);
  
  const taskStatusCount = allTasks.reduce((acc: Record<string, number>, task) => {
    if (task.status) {
      acc[task.status] = (acc[task.status] || 0) + 1;
    }
    return acc;
  }, {});

  const taskStatusData = Object.entries(taskStatusCount).map(([status, count]) => ({
    name: STATUS_LABELS[status as keyof typeof STATUS_LABELS],
    value: count,
    color: STATUS_COLORS[status as keyof typeof STATUS_COLORS],
  }));

  const totalTasks = allTasks.length;
  const completedTasks = allTasks.filter(
    (task) => task.status === "concluida"
  ).length;
  const overdueTasks = allTasks.filter(
    (task) => task.status === "atrasada"
  ).length;
  const inProgressTasks = allTasks.filter(
    (task) => task.status === "em_andamento"
  ).length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Painel de Metas</h2>
        <p className="text-muted-foreground">
          Análise detalhada do progresso das metas e tarefas
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Tarefas</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTasks}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tarefas Concluídas</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedTasks}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Andamento</CardTitle>
            <Loader className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inProgressTasks}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tarefas Atrasadas</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overdueTasks}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Distribuição de Status</CardTitle>
            <CardDescription>Status das tarefas em todas as metas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={taskStatusData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {taskStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status por Meta</CardTitle>
            <CardDescription>Progresso individual de cada meta</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {goals.map((goal) => {
                const totalWeight = goal.goal_tasks?.reduce(
                  (sum, task) => sum + (task.weight || 1),
                  0
                ) || 0;
                const completedWeight = goal.goal_tasks?.reduce(
                  (sum, task) =>
                    sum + (task.status === "concluida" ? task.weight || 1 : 0),
                  0
                ) || 0;
                const progress = totalWeight > 0 ? (completedWeight / totalWeight) * 100 : 0;

                return (
                  <div key={goal.id} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{goal.description}</p>
                        <Badge variant="outline">
                          {GOAL_TYPE_LABELS[goal.goal_type]}
                        </Badge>
                      </div>
                      <span className="text-sm font-medium">{progress.toFixed(0)}%</span>
                    </div>
                    <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GoalDashboard;