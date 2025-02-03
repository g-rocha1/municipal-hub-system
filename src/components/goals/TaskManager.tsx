import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { TaskForm } from "./TaskForm";
import { TaskList } from "./TaskList";
import { Task } from "./types";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface TaskManagerProps {
  tasks: Task[];
  onAddTask: (task: Task) => void;
  onRemoveTask: (index: number) => void;
}

export const TaskManager = ({ tasks, onAddTask, onRemoveTask }: TaskManagerProps) => {
  const [showTaskForm, setShowTaskForm] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleAddTask = async (task: Task) => {
    try {
      if (!user) {
        console.error("TaskManager - Usuário não autenticado");
        toast.error("Você precisa estar autenticado para adicionar tarefas");
        navigate("/login");
        return;
      }

      console.log("TaskManager - Adicionando tarefa:", task);
      await onAddTask(task);
      setShowTaskForm(false);
      toast.success("Tarefa adicionada com sucesso!");
    } catch (error: any) {
      console.error("TaskManager - Erro ao adicionar tarefa:", error);
      toast.error(error.message || "Erro ao adicionar tarefa");
    }
  };

  const handleRemoveTask = async (index: number) => {
    try {
      if (!user) {
        console.error("TaskManager - Usuário não autenticado");
        toast.error("Você precisa estar autenticado para remover tarefas");
        navigate("/login");
        return;
      }

      console.log("TaskManager - Removendo tarefa:", index);
      await onRemoveTask(index);
      toast.success("Tarefa removida com sucesso!");
    } catch (error: any) {
      console.error("TaskManager - Erro ao remover tarefa:", error);
      toast.error(error.message || "Erro ao remover tarefa");
    }
  };

  return (
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
          <div className="space-y-4">
            <TaskForm onSubmit={handleAddTask} />
          </div>
        ) : (
          <TaskList tasks={tasks} onRemoveTask={handleRemoveTask} />
        )}
      </CardContent>
    </Card>
  );
};