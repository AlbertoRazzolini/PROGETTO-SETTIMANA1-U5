import { api, listOrEmpty } from "./client";
import type { NewPoiBody, PoiResp } from "./types";

export const poisApi = {
  getAll: () => listOrEmpty(api.get<PoiResp[]>("/pois")),
  getById: (id: string) => api.get<PoiResp>(`/pois/${id}`),
  create: (body: NewPoiBody) => api.post<PoiResp>("/pois", body),
  delete: (id: string) => api.delete(`/pois/${id}`),
  getByRiquadro: (nord: number, sud: number, est: number, ovest: number) =>
    listOrEmpty(
      api.get<PoiResp[]>(
        `/pois/ricquadro?nord=${nord}&sud=${sud}&est=${est}&ovest=${ovest}`
      )
    ),
};
