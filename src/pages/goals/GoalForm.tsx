import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { GoalFormFields } from "@/components/goals/GoalFormFields";
import { TaskManager } from "@/components/goals/TaskManager";
import { GoalFormData, Task } from "@/components/goals/types";

interface GoalFormProps {
  initialData?: GoalFormData & {
    id: string;
  };
}

const GoalForm = ({ initialData }: GoalFormProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isEditing = !!initialData;
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<GoalFormData>({
    defaultValues: {
      title: initialData?.title || "",
      year: initialData?.year || new Date().getFullYear(),
      goal_type: initialData?.goal_type || "financeira",
      description: initialData?.description || "",
    },
  });

  const handleAddTask = (task: Task) => {
    console.log("GoalForm - Adicionando tarefa:", task);
    setTasks([...tasks, task]);
  };

  const handleRemoveTask = (index: number) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const onSubmit = async (values: GoalFormData) => {
    try {
      if (!user) {
        toast.error("Usuário não autenticado");
        return;
      }

      console.log("GoalForm - Iniciando submissão", { values, tasks });
      setIsSubmitting(true);
      let goalId: string;

      if (isEditing) {
        const { error } = await supabase
          .from("goals")
          .update({
            title: values.title,
            year: values.year,
            goal_type: values.goal_type,
            description: values.description,
          })
          .eq("id", initialData.id);

        if (error) throw error;
        goalId = initialData.id;
        toast.success("Meta atualizada com sucesso!");
      } else {
        const { data, error } = await supabase
          .from("goals")
          .insert({
            title: values.title,
            year: values.year,
            goal_type: values.goal_type,
            description: values.description,
            created_by: user.id,
          })
          .select()
          .single();

        if (error) throw error;
        goalId = data.id;
        console.log("GoalForm - Meta criada:", data);
        toast.success("Meta criada com sucesso!");
      }

      if (tasks.length > 0) {
        console.log("GoalForm - Inserindo tarefas:", tasks);
        const { error: tasksError } = await supabase.from("goal_tasks").insert(
          tasks.map((task) => ({
            ...task,
            goal_id: goalId,
            created_by: user.id,
          }))
        );

        if (tasksError) {
          console.error("GoalForm - Erro ao inserir tarefas:", tasksError);
          throw tasksError;
        }
        console.log("GoalForm - Tarefas inseridas com sucesso");
      }

      navigate("/goals");
    } catch (error: any) {
      console.error("GoalForm - Erro na submissão:", error);
      toast.error(error.message || "Ocorreu um erro ao salvar a meta");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          {isEditing ? "Editar Meta" : "Nova Meta"}
        </h2>
        <p className="text-muted-foreground">
          {isEditing
            ? "Atualize os dados da meta"
            : "Preencha os dados para criar uma nova meta"}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <GoalFormFields form={form} />
          <TaskManager
            tasks={tasks}
            onAddTask={handleAddTask}
            onRemoveTask={handleRemoveTask}
          />

          <div className="flex gap-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Salvando..." : isEditing ? "Atualizar" : "Criar"} Meta
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/goals")}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default GoalForm;