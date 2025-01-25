import { api } from './api';

export interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  role?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateUserData {
  name: string;
  email: string;
  username: string;
  password: string;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  username?: string;
  password?: string;
}

export const userService = {
  create: async (userData: CreateUserData) => {
    const response = await api.post<User>('/users', userData);
    return response.data;
  },

  list: async () => {
    const response = await api.get<User[]>('/users');
    return response.data;
  },

  update: async (id: string, userData: UpdateUserData) => {
    const response = await api.put<User>(`/users/${id}`, userData);
    return response.data;
  },

  delete: async (id: string) => {
    await api.delete(`/users/${id}`);
  },

  getById: async (id: string) => {
    const response = await api.get<User>(`/users/${id}`);
    return response.data;
  }
};