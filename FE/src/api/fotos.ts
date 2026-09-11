import { api, listOrEmpty } from "./client";
import type { FotoResp, NewFotoBody, UpdateFotoBody } from "./types";

export const fotosApi = {
  getAll: () => listOrEmpty(api.get<FotoResp[]>("/fotos")),
  getById: (id: string) => api.get<FotoResp>(`/fotos/${id}`),
  create: (body: NewFotoBody) => api.post<FotoResp>("/fotos", body),
  update: (id: string, body: UpdateFotoBody) => api.patch<FotoResp>(`/fotos/${id}`, body),
  delete: (id: string) => api.delete(`/fotos/${id}`),
};
