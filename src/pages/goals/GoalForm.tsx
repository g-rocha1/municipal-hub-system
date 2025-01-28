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

interface GoalFormProps {
  initialData?: {
    id: string;
    year: number;
    type: "receita" | "despesa";
    target_amount: number;
    current_amount: number;
    description: string;
  };
}

const GoalForm = ({ initialData }: GoalFormProps) => {
  const navigate = useNavigate();
  const isEditing = !!initialData;

  const form = useForm({
    defaultValues: {
      year: initialData?.year || new Date().getFullYear(),
      type: initialData?.type || "receita",
      target_amount: initialData?.target_amount || 0,
      current_amount: initialData?.current_amount || 0,
      description: initialData?.description || "",
    },
  });

  const onSubmit = async (values: any) => {
    try {
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
        toast.success("Meta atualizada com sucesso!");
      } else {
        const { error } = await supabase.from("financial_goals").insert([
          {
            year: values.year,
            type: values.type,
            target_amount: values.target_amount,
            current_amount: values.current_amount,
            description: values.description,
          },
        ]);

        if (error) throw error;
        toast.success("Meta criada com sucesso!");
      }

      navigate("/goals");
    } catch (error: any) {
      toast.error(error.message || "Ocorreu um erro ao salvar a meta");
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
                  <Input type="number" {...field} />
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
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
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
                  <Input type="number" step="0.01" {...field} />
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
                  <Input type="number" step="0.01" {...field} />
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