import { api, listOrEmpty } from "./client";
import type { NewPostBody, PostResp, UpdatePostBody } from "./types";

export const postsApi = {
  getAll: () => listOrEmpty(api.get<PostResp[]>("/posts")),
  getById: (id: string) => api.get<PostResp>(`/posts/${id}`),
  create: (body: NewPostBody) => api.post<PostResp>("/posts", body),
  update: (id: string, body: UpdatePostBody) => api.patch<PostResp>(`/posts/${id}`, body),
  delete: (id: string) => api.delete(`/posts/${id}`),
};
