// ===========================================
// API Client - HTTP komunikácia s backendom
// ===========================================

import { ApiError } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

// ===========================================
// Token Management
// ===========================================

let authToken: string | null = null;

export function setAuthToken(token: string | null): void {
  authToken = token;
  if (typeof window !== "undefined") {
    if (token) {
      localStorage.setItem("auth_token", token);
    } else {
      localStorage.removeItem("auth_token");
    }
  }
}

export function getAuthToken(): string | null {
  if (authToken) return authToken;
  if (typeof window !== "undefined") {
    authToken = localStorage.getItem("auth_token");
  }
  return authToken;
}

export function clearAuthToken(): void {
  authToken = null;
  if (typeof window !== "undefined") {
    localStorage.removeItem("auth_token");
  }
}

// ===========================================
// API Error Handling
// ===========================================

export class ApiClientError extends Error {
  code: string;
  status: number;
  field?: string;

  constructor(message: string, code: string, status: number, field?: string) {
    super(message);
    this.name = "ApiClientError";
    this.code = code;
    this.status = status;
    this.field = field;
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  const data = await response.json();

  if (!response.ok) {
    const apiError = data as ApiError;

    // Handle structured errors
    if (apiError.error) {
      throw new ApiClientError(apiError.error.message, apiError.error.code, response.status);
    }

    // Handle validation errors
    if (apiError.errors && apiError.errors.length > 0) {
      const firstError = apiError.errors[0];
      throw new ApiClientError(firstError.message, firstError.code, response.status, firstError.field);
    }

    // Generic error
    throw new ApiClientError("An unexpected error occurred", "UNKNOWN_ERROR", response.status);
  }

  return data as T;
}

// ===========================================
// HTTP Methods
// ===========================================

interface RequestOptions {
  headers?: Record<string, string>;
  requiresAuth?: boolean;
}

export async function apiGet<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { headers = {}, requiresAuth = true } = options;

  const requestHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...headers,
  };

  if (requiresAuth) {
    const token = getAuthToken();
    if (token) {
      requestHeaders["Authorization"] = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    method: "GET",
    headers: requestHeaders,
  });

  return handleResponse<T>(response);
}

export async function apiPost<T, D = unknown>(endpoint: string, data?: D, options: RequestOptions = {}): Promise<T> {
  const { headers = {}, requiresAuth = true } = options;

  const requestHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...headers,
  };

  if (requiresAuth) {
    const token = getAuthToken();
    if (token) {
      requestHeaders["Authorization"] = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    method: "POST",
    headers: requestHeaders,
    body: data ? JSON.stringify(data) : undefined,
  });

  return handleResponse<T>(response);
}

export async function apiPut<T, D = unknown>(endpoint: string, data?: D, options: RequestOptions = {}): Promise<T> {
  const { headers = {}, requiresAuth = true } = options;

  const requestHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...headers,
  };

  if (requiresAuth) {
    const token = getAuthToken();
    if (token) {
      requestHeaders["Authorization"] = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    method: "PUT",
    headers: requestHeaders,
    body: data ? JSON.stringify(data) : undefined,
  });

  return handleResponse<T>(response);
}

export async function apiPatch<T, D = unknown>(endpoint: string, data?: D, options: RequestOptions = {}): Promise<T> {
  const { headers = {}, requiresAuth = true } = options;

  const requestHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...headers,
  };

  if (requiresAuth) {
    const token = getAuthToken();
    if (token) {
      requestHeaders["Authorization"] = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    method: "PATCH",
    headers: requestHeaders,
    body: data ? JSON.stringify(data) : undefined,
  });

  return handleResponse<T>(response);
}

export async function apiDelete<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { headers = {}, requiresAuth = true } = options;

  const requestHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...headers,
  };

  if (requiresAuth) {
    const token = getAuthToken();
    if (token) {
      requestHeaders["Authorization"] = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    method: "DELETE",
    headers: requestHeaders,
  });

  return handleResponse<T>(response);
}

// ===========================================
// Health Check
// ===========================================

export async function checkApiHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/health`);
    return response.ok;
  } catch {
    return false;
  }
}
