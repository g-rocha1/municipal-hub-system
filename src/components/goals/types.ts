import { Database } from "@/integrations/supabase/types";

export type TaskStatus = Database["public"]["Tables"]["goal_tasks"]["Row"]["status"];
export type GoalType = "financeira" | "estrategica" | "operacional";

export const GOAL_TYPES = [
  { value: "financeira", label: "Financeira" },
  { value: "estrategica", label: "Estratégica" },
  { value: "operacional", label: "Operacional" },
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