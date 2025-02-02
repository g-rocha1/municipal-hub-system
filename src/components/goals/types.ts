import { Database } from "@/integrations/supabase/types";

export type TaskStatus = Database["public"]["Tables"]["goal_tasks"]["Row"]["status"];
export type GoalType = Database["public"]["Enums"]["goal_type"];

export const GOAL_TYPES = [
  { value: "financeira", label: "Financeira" },
  { value: "educacional", label: "Educacional" },
  { value: "saude", label: "Saúde" },
  { value: "infraestrutura", label: "Infraestrutura" },
  { value: "social", label: "Social" },
  { value: "ambiental", label: "Ambiental" },
  { value: "cultural", label: "Cultural" },
  { value: "esporte", label: "Esporte" },
  { value: "outros", label: "Outros" },
] as const;

export interface TaskFormData {
  title: string;
  description: string;
  status: TaskStatus;
  weight: number;
}

export interface Task extends TaskFormData {
  id?: string;
  due_date?: string;
}

export interface GoalFormData {
  title: string;
  year: number;
  goal_type: GoalType;
  description: string;
}