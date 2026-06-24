export interface Pais {
  id: number;
  nombre: string;
  codigoIso: string | null;
  activo: boolean;
}

export interface Cliente {
  id: number;
  nombre: string;
  email: string;
  telefono: string | null;
  direccion: string | null;
  ciudad: string | null;
  paisId: number | null;
  codigoPostal: string | null;
  estado: string;
  fechaCreacion: string;
  pais: { nombre: string } | null;
}

export interface CrearClientePayload {
  nombre: string;
  email: string;
  telefono?: string;
  direccion?: string;
  ciudad?: string;
  paisId?: number;
  codigoPostal?: string;
}

export interface ActualizarClientePayload extends Partial<CrearClientePayload> {
  estado?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface ApiError {
  success: false;
  error: string;
  errors?: { campo: string; mensaje: string }[];
}
