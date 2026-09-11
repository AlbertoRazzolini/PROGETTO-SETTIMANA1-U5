const BASE_URL = "http://localhost:5174/api";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const isFormData = options.body instanceof FormData;
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: isFormData
      ? options.headers
      : { "Content-Type": "application/json", ...(options.headers ?? {}) },
  });

  if (!res.ok) {
    let message = `Si è verificato un errore (${res.status})`;
    try {
      const body = await res.json();
      if (body?.message) message = body.message;
    } catch {
      // risposta senza corpo JSON, si usa il messaggio di default
    }
    throw new ApiError(message, res.status);
  }

  if (res.status === 204) return undefined as T;

  const text = await res.text();
  return text ? (JSON.parse(text) as T) : (undefined as T);
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "POST", body: body !== undefined ? JSON.stringify(body) : undefined }),
  postForm: <T>(path: string, form: FormData) =>
    request<T>(path, { method: "POST", body: form }),
  patch: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "PATCH", body: JSON.stringify(body) }),
  delete: (path: string) => request<void>(path, { method: "DELETE" }),
};

/** Il backend risponde 404 quando una lista è vuota: qui la normalizziamo in array vuoto. */
export async function listOrEmpty<T>(promise: Promise<T[]>): Promise<T[]> {
  try {
    return await promise;
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) return [];
    throw e;
  }
}
