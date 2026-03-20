import { getAuthToken } from "@/lib/auth/getToken";
import { BACKEND_URL } from "@/lib/config";

interface ApiRequestOptions extends RequestInit {
  body?: any;
}

interface ApiResponse<T> {
  ok: boolean;
  status: number;
  data?: T;
  error?: any;
}

async function apiCall<T>(
  url: string,
  options: ApiRequestOptions = {},
  external?: boolean
): Promise<ApiResponse<T>> {
  try {
    const token = await getAuthToken();
    
    const headers = new Headers({
      "Content-Type": "application/json",
      ...options.headers,
    });

    if (token && !external) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    const fullUrl = url.startsWith("http") ? url : `${BACKEND_URL}${url}`;

    const response = await fetch(fullUrl, {
      ...options,
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
    });

    const data = await response.json().catch(() => null);

    return {
      ok: response.ok,
      status: response.status,
      data: response.ok ? data : undefined,
      error: !response.ok ? data : undefined,
    };
  } catch (error) {
    console.error("API Error:", error);
    return {
      ok: false,
      status: 500,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function apiGet<T>(url: string): Promise<ApiResponse<T>> {
  return apiCall<T>(url, { method: "GET" });
}

export async function apiPost<T>(
  url: string,
  body: any
): Promise<ApiResponse<T>> {
  return apiCall<T>(url, { method: "POST", body });
}

export async function apiPatch<T>(
  url: string,
  body: any
): Promise<ApiResponse<T>> {
  return apiCall<T>(url, { method: "PATCH", body });
}

export async function apiDelete<T>(
  url: string,
  body?: any
): Promise<ApiResponse<T>> {
  return apiCall<T>(url, { method: "DELETE", body });
}

export async function apiPut<T>(
  url: string,
  body: any,
  headers?: any,
  external?: boolean
): Promise<ApiResponse<T>> {
  return apiCall<T>(url, { method: "PUT", body, headers }, external);
}
