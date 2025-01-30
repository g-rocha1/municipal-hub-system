export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      event_registrations: {
        Row: {
          created_at: string
          email: string
          event_id: string | null
          id: string
          participant_name: string
          phone: string | null
          registration_date: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          event_id?: string | null
          id?: string
          participant_name: string
          phone?: string | null
          registration_date?: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          event_id?: string | null
          id?: string
          participant_name?: string
          phone?: string | null
          registration_date?: string
          status?: string
          updated_at?: string
        }
      }
      events: {
        Row: {
          created_at: string
          created_by: string
          current_participants: number | null
          description: string | null
          end_date: string
          id: string
          location: string | null
          max_participants: number | null
          project_id: string | null
          start_date: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          current_participants?: number | null
          description?: string | null
          end_date: string
          id?: string
          location?: string | null
          max_participants?: number | null
          project_id?: string | null
          start_date: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          current_participants?: number | null
          description?: string | null
          end_date?: string
          id?: string
          location?: string | null
          max_participants?: number | null
          project_id?: string | null
          start_date?: string
          title?: string
          updated_at?: string
        }
      }
      financial_goals: {
        Row: {
          created_at: string
          created_by: string
          current_amount: number | null
          description: string
          id: string
          target_amount: number
          type: Database["public"]["Enums"]["transaction_type"]
          updated_at: string
          year: number
          progress: number | null
        }
        Insert: {
          created_at?: string
          created_by: string
          current_amount?: number | null
          description: string
          id?: string
          target_amount: number
          type: Database["public"]["Enums"]["transaction_type"]
          updated_at?: string
          year: number
          progress?: number | null
        }
        Update: {
          created_at?: string
          created_by?: string
          current_amount?: number | null
          description?: string
          id?: string
          target_amount?: number
          type?: Database["public"]["Enums"]["transaction_type"]
          updated_at?: string
          year?: number
          progress?: number | null
        }
      }
      goal_tasks: {
        Row: {
          id: string
          goal_id: string
          title: string
          description: string | null
          status: Database["public"]["Enums"]["task_status"]
          due_date: string | null
          weight: number | null
          created_at: string
          updated_at: string
          created_by: string
        }
        Insert: {
          id?: string
          goal_id: string
          title: string
          description?: string | null
          status?: Database["public"]["Enums"]["task_status"]
          due_date?: string | null
          weight?: number | null
          created_at?: string
          updated_at?: string
          created_by: string
        }
        Update: {
          id?: string
          goal_id?: string
          title?: string
          description?: string | null
          status?: Database["public"]["Enums"]["task_status"]
          due_date?: string | null
          weight?: number | null
          created_at?: string
          updated_at?: string
          created_by?: string
        }
      }
      financial_transactions: {
        Row: {
          amount: number
          category: Database["public"]["Enums"]["financial_category"]
          created_at: string
          created_by: string
          date: string
          description: string
          document_url: string | null
          id: string
          notes: string | null
          type: Database["public"]["Enums"]["transaction_type"]
          updated_at: string
        }
        Insert: {
          amount: number
          category: Database["public"]["Enums"]["financial_category"]
          created_at?: string
          created_by: string
          date: string
          description: string
          document_url?: string | null
          id?: string
          notes?: string | null
          type: Database["public"]["Enums"]["transaction_type"]
          updated_at?: string
        }
        Update: {
          amount?: number
          category?: Database["public"]["Enums"]["financial_category"]
          created_at?: string
          created_by?: string
          date?: string
          description?: string
          document_url?: string | null
          id?: string
          notes?: string | null
          type?: Database["public"]["Enums"]["transaction_type"]
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          id: string
          nome: string
          permissions: string[] | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id: string
          nome: string
          permissions?: string[] | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          nome?: string
          permissions?: string[] | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: []
      }
      project_milestones: {
        Row: {
          completed: boolean | null
          created_at: string
          description: string | null
          due_date: string | null
          id: string
          project_id: string | null
          responsible_user_id: string | null
          title: string
          updated_at: string
        }
        Insert: {
          completed?: boolean | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          project_id?: string | null
          responsible_user_id?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          completed?: boolean | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          project_id?: string | null
          responsible_user_id?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_milestones_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          budget: number
          created_at: string
          created_by: string
          description: string | null
          end_date: string | null
          id: string
          location: string | null
          name: string
          objectives: string | null
          responsible_user_id: string | null
          start_date: string | null
          status: Database["public"]["Enums"]["project_status"]
          target_audience: string | null
          updated_at: string
        }
        Insert: {
          budget?: number
          created_at?: string
          created_by: string
          description?: string | null
          end_date?: string | null
          id?: string
          location?: string | null
          name: string
          objectives?: string | null
          responsible_user_id?: string | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["project_status"]
          target_audience?: string | null
          updated_at?: string
        }
        Update: {
          budget?: number
          created_at?: string
          created_by?: string
          description?: string | null
          end_date?: string | null
          id?: string
          location?: string | null
          name?: string
          objectives?: string | null
          responsible_user_id?: string | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["project_status"]
          target_audience?: string | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      financial_category:
        | "impostos"
        | "taxas"
        | "transferencias"
        | "outros_receita"
        | "pessoal"
        | "materiais"
        | "servicos"
        | "outros_despesa"
      project_status: "planejamento" | "execucao" | "concluido" | "cancelado"
      transaction_type: "receita" | "despesa"
      user_role: "master" | "prefeito" | "secretario" | "user"
      task_status: "pendente" | "em_andamento" | "concluida" | "atrasada" | "em_espera"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
