import { Button } from "@/components/ui/button";
import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ArrowUp, ArrowDown } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { TaskFormData } from "./types";

interface TaskPrioritySelectorProps {
  form: UseFormReturn<TaskFormData>;
  setPriority: (priority: number) => void;
}

export const TaskPrioritySelector = ({ form, setPriority }: TaskPrioritySelectorProps) => {
  return (
    <FormField
      control={form.control}
      name="weight"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Prioridade</FormLabel>
          <div className="flex gap-2">
            <Button
              type="button"
              variant={field.value === 1 ? "default" : "outline"}
              onClick={() => setPriority(1)}
              className="flex-1"
            >
              <ArrowDown className="mr-2 h-4 w-4" />
              Baixa
            </Button>
            <Button
              type="button"
              variant={field.value === 2 ? "default" : "outline"}
              onClick={() => setPriority(2)}
              className="flex-1"
            >
              <ArrowUp className="mr-2 h-4 w-4 text-yellow-500" />
              Média
            </Button>
            <Button
              type="button"
              variant={field.value === 3 ? "default" : "outline"}
              onClick={() => setPriority(3)}
              className="flex-1"
            >
              <ArrowUp className="mr-2 h-4 w-4 text-red-500" />
              Alta
            </Button>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};