import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import TaskForm from "@/components/goals/TaskForm";
import { Plus, Check, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Database } from "@/integrations/supabase/types";

type TaskStatus = Database["public"]["Enums"]["task_status"];

interface GoalFormData {
  year: number;
  type: "receita" | "despesa";
  target_amount: number;
  current_amount: number;
  description: string;
}

interface Task {
  id?: string;
  title: string;
  description?: string;
  status: TaskStatus;
  due_date?: string;
  weight: number;
}

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
  const [showTaskForm, setShowTaskForm] = useState(false);

  const form = useForm<GoalFormData>({
    defaultValues: {
      year: initialData?.year || new Date().getFullYear(),
      type: initialData?.type || "receita",
      target_amount: initialData?.target_amount || 0,
      current_amount: initialData?.current_amount || 0,
      description: initialData?.description || "",
    },
  });

  const handleAddTask = (task: Task) => {
    setTasks([...tasks, task]);
    setShowTaskForm(false);
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

      let goalId: string;

      if (isEditing) {
        const { error } = await supabase
          .from("financial_goals")
          .update({
            year: values.year,
            type: values.type,
            target_amount: values.target_amount,
            current_amount: values.current_amount,
            description: values.description,
          })
          .eq("id", initialData.id);

        if (error) throw error;
        goalId = initialData.id;
        toast.success("Meta atualizada com sucesso!");
      } else {
        const { data, error } = await supabase
          .from("financial_goals")
          .insert({
            year: values.year,
            type: values.type,
            target_amount: values.target_amount,
            current_amount: values.current_amount,
            description: values.description,
            created_by: user.id,
          })
          .select()
          .single();

        if (error) throw error;
        goalId = data.id;
        toast.success("Meta criada com sucesso!");
      }

      // Insert tasks
      if (tasks.length > 0) {
        const { error: tasksError } = await supabase.from("goal_tasks").insert(
          tasks.map((task) => ({
            ...task,
            goal_id: goalId,
            created_by: user.id,
          }))
        );

        if (tasksError) throw tasksError;
      }

      navigate("/goals");
    } catch (error: any) {
      toast.error(error.message || "Ocorreu um erro ao salvar a meta");
    }
  };

  const getStatusColor = (status: TaskStatus) => {
    const colors = {
      pendente: "bg-yellow-500",
      em_andamento: "bg-blue-500",
      concluida: "bg-green-500",
      atrasada: "bg-red-500",
      em_espera: "bg-gray-500",
    };
    return colors[status];
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          {isEditing ? "Editar Meta" : "Nova Meta"}
        </h2>
        <p className="text-muted-foreground">
          {isEditing
            ? "Atualize os dados da meta financeira"
            : "Preencha os dados para criar uma nova meta financeira"}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="year"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ano</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="receita">Receita</SelectItem>
                    <SelectItem value="despesa">Despesa</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="target_amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valor da Meta</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="current_amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valor Atual</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descrição</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tarefas</CardTitle>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowTaskForm(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Tarefa
              </Button>
            </CardHeader>
            <CardContent>
              {showTaskForm ? (
                <TaskForm
                  goalId={initialData?.id || ""}
                  onSubmit={handleAddTask}
                  onCancel={() => setShowTaskForm(false)}
                />
              ) : (
                <div className="space-y-2">
                  {tasks.map((task, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 border rounded-lg"
                    >
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{task.title}</span>
                        <Badge
                          variant="secondary"
                          className={cn("text-white", getStatusColor(task.status))}
                        >
                          {task.status}
                        </Badge>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveTask(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button type="submit">
              {isEditing ? "Atualizar" : "Criar"} Meta
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