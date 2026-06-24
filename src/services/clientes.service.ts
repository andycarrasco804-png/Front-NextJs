import { api } from "./api";
import type {
  Cliente,
  CrearClientePayload,
  ActualizarClientePayload,
  ApiResponse,
  PaginatedResponse,
} from "@/types";

export const clientesService = {
  getAll: (page = 1, limit = 10) =>
    api.get<PaginatedResponse<Cliente>>(`/clientes?page=${page}&limit=${limit}`),

  getById: (id: number) =>
    api.get<ApiResponse<Cliente>>(`/clientes/${id}`).then((r) => r.data),

  create: (payload: CrearClientePayload) =>
    api.post<ApiResponse<Cliente>>("/clientes", payload).then((r) => r.data),

  update: (id: number, payload: ActualizarClientePayload) =>
    api.put<ApiResponse<Cliente>>(`/clientes/${id}`, payload).then((r) => r.data),

  delete: (id: number) => api.delete<void>(`/clientes/${id}`),
};
