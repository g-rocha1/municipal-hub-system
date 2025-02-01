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
import { useForm } from "react-hook-form";
import { Database } from "@/integrations/supabase/types";
import { CalendarIcon, ArrowUp, ArrowDown } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

type TaskStatus = Database["public"]["Enums"]["task_status"];

interface TaskFormData {
  title: string;
  description: string;
  status: TaskStatus;
  weight: number;
}

interface TaskFormProps {
  onSubmit: (data: TaskFormData & { due_date?: string }) => void;
  defaultValues?: Partial<TaskFormData & { due_date?: string }>;
}

export function TaskForm({ onSubmit, defaultValues }: TaskFormProps) {
  const { user } = useAuth();
  const [date, setDate] = React.useState<Date | undefined>(
    defaultValues?.due_date ? new Date(defaultValues.due_date) : undefined
  );

  const form = useForm<TaskFormData>({
    defaultValues: {
      title: defaultValues?.title || "",
      description: defaultValues?.description || "",
      status: defaultValues?.status || "pendente",
      weight: defaultValues?.weight || 1,
    },
  });

  const handleSubmit = (values: TaskFormData) => {
    const formData = {
      ...values,
      due_date: date?.toISOString().split("T")[0],
    };
    onSubmit(formData);
  };

  const setPriority = (priority: number) => {
    form.setValue("weight", priority);
  };

  if (!user) return null;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título da Tarefa</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Digite o título da tarefa" />
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
                <Input {...field} placeholder="Digite a descrição da tarefa" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="pendente">Pendente</SelectItem>
                  <SelectItem value="em_andamento">Em Andamento</SelectItem>
                  <SelectItem value="concluida">Concluída</SelectItem>
                  <SelectItem value="cancelada">Cancelada</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormItem>
          <FormLabel>Data de Conclusão</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full pl-3 text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  {date ? format(date, "dd/MM/yyyy") : "Selecione uma data"}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                disabled={(date) =>
                  date < new Date(new Date().setHours(0, 0, 0, 0))
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </FormItem>

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

        <div className="flex justify-end">
          <Button type="submit">Salvar</Button>
        </div>
      </form>
    </Form>
  );
}