import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { Task } from "./types";
import { cn } from "@/lib/utils";

interface TaskListProps {
  tasks: Task[];
  onRemoveTask: (index: number) => void;
}

export const TaskList = ({ tasks, onRemoveTask }: TaskListProps) => {
  const getStatusColor = (status: Task["status"]) => {
    const colors = {
      pendente: "bg-yellow-500",
      em_andamento: "bg-blue-500",
      concluida: "bg-green-500",
      cancelada: "bg-red-500",
    };
    return colors[status];
  };

  return (
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
            onClick={() => onRemoveTask(index)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
};