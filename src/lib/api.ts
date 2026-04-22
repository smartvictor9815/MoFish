import { clearToken, getToken } from "./session";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

type RequestOptions = RequestInit & {
  skipAuth?: boolean;
};

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const { skipAuth = false, headers, ...rest } = options;
  const token = getToken();
  const requestHeaders = new Headers(headers);

  if (!requestHeaders.has("Content-Type") && rest.body) {
    requestHeaders.set("Content-Type", "application/json");
  }
  if (!skipAuth && token) {
    requestHeaders.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: requestHeaders,
  });

  if (response.status === 401) {
    clearToken();
  }

  if (!response.ok) {
    let detail = "请求失败";
    try {
      const payload = await response.json();
      detail = payload.detail ?? detail;
    } catch {
      // Keep fallback detail.
    }
    throw new Error(detail);
  }

  if (response.status === 204) {
    return undefined as T;
  }
  return response.json() as Promise<T>;
}
