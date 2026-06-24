import { api } from "./api";
import type { Pais, ApiResponse } from "@/types";

export const paisesService = {
  getAll: () =>
    api.get<ApiResponse<Pais[]>>("/paises").then((r) => r.data),
};
