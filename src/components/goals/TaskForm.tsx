import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { useAuth } from "@/contexts/AuthContext";
import { TaskFormData } from "./types";
import { TaskFormFields } from "./TaskFormFields";
import { TaskPrioritySelector } from "./TaskPrioritySelector";
import { TaskDatePicker } from "./TaskDatePicker";

interface TaskFormProps {
  onSubmit: (data: TaskFormData & { due_date?: string }) => void;
  defaultValues?: Partial<TaskFormData & { due_date?: string }>;
}

export const TaskForm = ({ onSubmit, defaultValues }: TaskFormProps) => {
  const { user } = useAuth();
  const [date, setDate] = useState<Date | undefined>(
    defaultValues?.due_date ? new Date(defaultValues.due_date) : undefined
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<TaskFormData>({
    defaultValues: {
      title: defaultValues?.title || "",
      description: defaultValues?.description || "",
      status: defaultValues?.status || "pendente",
      weight: defaultValues?.weight || 1,
    },
  });

  const handleSubmit = async (values: TaskFormData) => {
    try {
      console.log("TaskForm - Iniciando submissão", values);
      setIsSubmitting(true);
      const formData = {
        ...values,
        due_date: date?.toISOString().split("T")[0],
      };
      console.log("TaskForm - Dados formatados", formData);
      await onSubmit(formData);
      console.log("TaskForm - Submissão concluída");
      form.reset();
      setDate(undefined);
    } catch (error) {
      console.error("TaskForm - Erro na submissão:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const setPriority = (priority: number) => {
    form.setValue("weight", priority);
  };

  if (!user) return null;

  return (
    <div className="space-y-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <TaskFormFields form={form} />
          <TaskDatePicker date={date} setDate={setDate} />
          <TaskPrioritySelector form={form} setPriority={setPriority} />

          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};