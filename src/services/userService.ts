import { api } from './api';

export type UserRole = 'master' | 'admin' | 'user';
export type UserPermission = 'viewUsers' | 'editUsers' | 'deleteUsers';

export interface User {
  id: string;
  nome: string;
  email: string;
  role: UserRole;
  permissions?: UserPermission[];
  created_by?: string;
  createdAt?: string;
  updatedAt?: string;
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
    const response = await api.post<User>('/api/users', userData);
    return response.data;
  },

  login: async (email: string, senha: string) => {
    const response = await api.post('/api/users/login', { email, senha });
    return response.data;
  },

  list: async () => {
    const response = await api.get<User[]>('/api/users');
    return response.data;
  },

  update: async (id: string, userData: UpdateUserData) => {
    const response = await api.put<User>(`/api/users/${id}`, userData);
    return response.data;
  },

  delete: async (id: string) => {
    await api.delete(`/api/users/${id}`);
  },

  changePassword: async (id: string, passwordData: ChangePasswordData) => {
    await api.put(`/api/users/${id}/senha`, passwordData);
  },

  getById: async (id: string) => {
    const response = await api.get<User>(`/api/users/${id}`);
    return response.data;
  }
};