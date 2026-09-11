import { api, listOrEmpty } from "./client";
import type { DocumentoResp, UpdateDocumentoBody } from "./types";

export const documentiApi = {
  getAll: () => listOrEmpty(api.get<DocumentoResp[]>("/documenti")),
  getById: (id: string) => api.get<DocumentoResp>(`/documenti/${id}`),
  create: (titolo: string, immagine: File) => {
    const form = new FormData();
    form.append("titolo", titolo);
    form.append("immagine", immagine);
    return api.postForm<DocumentoResp>("/documenti", form);
  },
  update: (id: string, body: UpdateDocumentoBody) => api.patch<DocumentoResp>(`/documenti/${id}`, body),
  delete: (id: string) => api.delete(`/documenti/${id}`),
};
