import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { TaskForm } from "./TaskForm";
import { TaskList } from "./TaskList";
import { Task } from "./types";

interface TaskManagerProps {
  tasks: Task[];
  onAddTask: (task: Task) => void;
  onRemoveTask: (index: number) => void;
}

export const TaskManager = ({ tasks, onAddTask, onRemoveTask }: TaskManagerProps) => {
  const [showTaskForm, setShowTaskForm] = useState(false);

  const handleAddTask = (task: Task) => {
    onAddTask(task);
    setShowTaskForm(false);
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
          <TaskList tasks={tasks} onRemoveTask={onRemoveTask} />
        )}
      </CardContent>
    </Card>
  );
};