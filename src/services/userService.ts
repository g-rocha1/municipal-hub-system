import { supabase } from "@/integrations/supabase/client";

export type UserRole = "master" | "prefeito" | "secretario" | "user";
export type UserPermission = "viewUsers" | "editUsers" | "deleteUsers";

export interface User {
  id: string;
  nome: string;
  email: string;
  role: UserRole;
  permissions?: UserPermission[];
  created_at?: string;
  updated_at?: string;
}

export interface CreateUserData {
  nome: string;
  email: string;
  senha: string;
  role: UserRole;
  permissions?: UserPermission[];
}

export interface UpdateUserData {
  nome?: string;
  email?: string;
  role?: UserRole;
  permissions?: UserPermission[];
}

export interface ChangePasswordData {
  senhaAtual: string;
  novaSenha: string;
}

export const userService = {
  create: async (userData: CreateUserData) => {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.senha,
      options: {
        data: {
          nome: userData.nome,
          role: userData.role,
        },
      },
    });

    if (authError) throw authError;
    return authData.user;
  },

  list: async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data as User[];
  },

  update: async (id: string, userData: UpdateUserData) => {
    const { data, error } = await supabase
      .from("profiles")
      .update(userData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as User;
  },

  delete: async (id: string) => {
    const { error } = await supabase
      .from("profiles")
      .delete()
      .eq("id", id);

    if (error) throw error;
  },

  changePassword: async (id: string, passwordData: ChangePasswordData) => {
    const { error } = await supabase.auth.updateUser({
      password: passwordData.novaSenha,
    });

    if (error) throw error;
  },

  getById: async (id: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data as User;
  },
};