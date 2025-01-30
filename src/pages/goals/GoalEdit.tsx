import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import GoalForm from "./GoalForm";
import { Skeleton } from "@/components/ui/skeleton";

const GoalEdit = () => {
  const { id } = useParams();

  const { data: goal, isLoading } = useQuery({
    queryKey: ["goal", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("goals")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-[250px]" />
        <Skeleton className="h-[200px] w-full" />
      </div>
    );
  }
  
  if (!goal) return <div>Meta não encontrada</div>;

  return <GoalForm initialData={goal} />;
};

export default GoalEdit;