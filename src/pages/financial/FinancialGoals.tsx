import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

const FinancialGoals = () => {
  const { data: goals, isLoading } = useQuery({
    queryKey: ['financial-goals'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('financial_goals')
        .select('*')
        .order('year', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Metas Financeiras</h1>
        <Button>Nova Meta</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {goals?.map((goal) => {
          const progress = (goal.current_amount / goal.target_amount) * 100;
          
          return (
            <Card key={goal.id}>
              <CardHeader>
                <CardTitle className="flex justify-between">
                  <span className="capitalize">{goal.type} {goal.year}</span>
                  <span className={goal.type === 'receita' ? 'text-green-600' : 'text-red-600'}>
                    {formatCurrency(goal.current_amount)} / {formatCurrency(goal.target_amount)}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Progress value={progress} className="h-2" />
                <p className="mt-2 text-sm text-muted-foreground">{goal.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default FinancialGoals;