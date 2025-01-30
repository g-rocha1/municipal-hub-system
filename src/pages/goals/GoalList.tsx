import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

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
        .select("*")
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

  const getGoalTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      financeira: "bg-green-100 text-green-800",
      educacional: "bg-blue-100 text-blue-800",
      saude: "bg-red-100 text-red-800",
      infraestrutura: "bg-yellow-100 text-yellow-800",
      social: "bg-purple-100 text-purple-800",
      ambiental: "bg-emerald-100 text-emerald-800",
      cultural: "bg-pink-100 text-pink-800",
      esporte: "bg-orange-100 text-orange-800",
      outros: "bg-gray-100 text-gray-800",
    };
    return colors[type] || colors.outros;
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
        <Button onClick={() => navigate("/goals/add")}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Meta
        </Button>
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

      {isLoading ? (
        <div>Carregando...</div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Descrição</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Meta</TableHead>
                <TableHead>Atual</TableHead>
                <TableHead>Progresso</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {goals?.map((goal) => (
                <TableRow
                  key={goal.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => navigate(`/goals/edit/${goal.id}`)}
                >
                  <TableCell>{goal.description}</TableCell>
                  <TableCell>
                    <Badge className={getGoalTypeColor(goal.goal_type)}>
                      {GOAL_TYPE_LABELS[goal.goal_type]}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatCurrency(goal.target_amount)}</TableCell>
                  <TableCell>{formatCurrency(goal.current_amount)}</TableCell>
                  <TableCell>
                    <div className="w-full bg-secondary rounded-full h-2.5">
                      <div
                        className="h-2.5 rounded-full bg-primary"
                        style={{
                          width: `${Math.min(
                            (goal.current_amount / goal.target_amount) * 100,
                            100
                          )}%`,
                        }}
                      ></div>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {goals?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6">
                    Nenhuma meta encontrada para o ano selecionado
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default GoalList;