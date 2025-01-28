import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import GoalForm from "./GoalForm";

const GoalEdit = () => {
  const { id } = useParams();

  const { data: goal, isLoading } = useQuery({
    queryKey: ["goal", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("financial_goals")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) return <div>Carregando...</div>;
  if (!goal) return <div>Meta não encontrada</div>;

  return <GoalForm initialData={goal} />;
};

export default GoalEdit;