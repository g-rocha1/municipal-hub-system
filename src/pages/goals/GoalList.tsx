import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus, BarChart2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

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

const GoalList = () => {
  const navigate = useNavigate();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const { data: goals, isLoading } = useQuery({
    queryKey: ["goals", selectedYear],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("goals")
        .select("*, goal_tasks(*)")
        .eq("year", selectedYear)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const years = Array.from(
    { length: 5 },
    (_, i) => new Date().getFullYear() - 2 + i
  );

  const getProgressColor = (progress: number) => {
    if (progress >= 75) return "bg-green-500";
    if (progress >= 50) return "bg-yellow-500";
    if (progress >= 25) return "bg-orange-500";
    return "bg-red-500";
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">Metas</h2>
          <p className="text-muted-foreground">
            Gerencie as metas da sua secretaria
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate("/goals/dashboard")}>
            <BarChart2 className="mr-2 h-4 w-4" />
            Dashboard
          </Button>
          <Button onClick={() => navigate("/goals/add")}>
            <Plus className="mr-2 h-4 w-4" />
            Nova Meta
          </Button>
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        {years.map((year) => (
          <Button
            key={year}
            variant={selectedYear === year ? "default" : "outline"}
            onClick={() => setSelectedYear(year)}
          >
            {year}
          </Button>
        ))}
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Descrição</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Progresso</TableHead>
              <TableHead>Tarefas</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {goals?.map((goal) => {
              const totalTasks = goal.goal_tasks?.length || 0;
              const completedTasks = goal.goal_tasks?.filter(
                (task) => task.status === "concluida"
              ).length || 0;

              return (
                <TableRow
                  key={goal.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => navigate(`/goals/edit/${goal.id}`)}
                >
                  <TableCell>{goal.description}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {GOAL_TYPE_LABELS[goal.goal_type]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                        <div
                          className={`h-full ${getProgressColor(goal.progress)}`}
                          style={{ width: `${goal.progress}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">
                        {goal.progress?.toFixed(0)}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">
                      {completedTasks} / {totalTasks}
                    </span>
                  </TableCell>
                </TableRow>
              );
            })}
            {goals?.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-6">
                  Nenhuma meta encontrada para o ano selecionado
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default GoalList;