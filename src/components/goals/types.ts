import { Database } from "@/integrations/supabase/types";

export type TaskStatus = Database["public"]["Tables"]["goal_tasks"]["Row"]["status"];

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