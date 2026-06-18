const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(token: string, path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...init?.headers,
    },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(body.error?.toString() ?? "Erreur API", res.status);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export const adminApiClient = {
  get: <T>(token: string, path: string) => request<T>(token, path),
  post: <T>(token: string, path: string, data: unknown) =>
    request<T>(token, path, { method: "POST", body: JSON.stringify(data) }),
  put: <T>(token: string, path: string, data: unknown) =>
    request<T>(token, path, { method: "PUT", body: JSON.stringify(data) }),
  patch: <T>(token: string, path: string, data: unknown) =>
    request<T>(token, path, { method: "PATCH", body: JSON.stringify(data) }),
  delete: <T>(token: string, path: string) => request<T>(token, path, { method: "DELETE" }),
  upload: async <T>(token: string, path: string, file: File): Promise<T> => {
    const formData = new FormData();
    formData.append("image", file);
    const res = await fetch(`${API_URL}${path}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new ApiError(body.error?.toString() ?? "Erreur API", res.status);
    }
    return res.json() as Promise<T>;
  },
  uploadWithFields: async <T>(
    token: string,
    path: string,
    fileField: string,
    file: File,
    fields: Record<string, string>
  ): Promise<T> => {
    const formData = new FormData();
    formData.append(fileField, file);
    for (const [key, value] of Object.entries(fields)) formData.append(key, value);
    const res = await fetch(`${API_URL}${path}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new ApiError(body.error?.toString() ?? "Erreur API", res.status);
    }
    return res.json() as Promise<T>;
  },
};
