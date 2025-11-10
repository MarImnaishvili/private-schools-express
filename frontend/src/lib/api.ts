/**
 * API Client for communicating with Express backend
 */

import { createClient } from './supabase/client';
import { SchoolFormData, SchoolDataWithCreator } from '../schemas/schema';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

interface RequestConfig extends RequestInit {
  params?: Record<string, string | number>;
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private buildURL(endpoint: string, params?: Record<string, string | number>): string {
    const url = new URL(endpoint, this.baseURL);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, String(value));
      });
    }

    return url.toString();
  }

  /**
   * Get authentication headers with Supabase session token
   */
  private async getAuthHeaders(): Promise<Record<string, string>> {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (session?.access_token) {
      headers['Authorization'] = `Bearer ${session.access_token}`;
    }

    return headers;
  }

  private async request<T>(endpoint: string, config: RequestConfig = {}): Promise<T> {
    const { params, ...fetchConfig } = config;
    const url = this.buildURL(endpoint, params);

    // Get auth headers
    const authHeaders = await this.getAuthHeaders();

    const defaultConfig: RequestInit = {
      headers: {
        ...authHeaders,
        ...fetchConfig.headers,
      },
      ...fetchConfig,
    };

    try {
      const response = await fetch(url, defaultConfig);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Request failed' }));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async get<T>(endpoint: string, params?: Record<string, string | number>): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET', params });
  }

  /**
   * Public GET request without authentication headers
   */
  async publicGet<T>(endpoint: string, params?: Record<string, string | number>): Promise<T> {
    const { params: queryParams, ...fetchConfig } = { params };
    const url = this.buildURL(endpoint, queryParams);

    const defaultConfig: RequestInit = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      ...fetchConfig,
    };

    try {
      const response = await fetch(url, defaultConfig);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Request failed' }));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

// Create and export a singleton instance
export const api = new ApiClient(API_BASE_URL);

// Export typed API methods for schools
export const schoolsApi = {
  // Authenticated requests (applies RBAC)
  getAll: (params?: { page?: number; pageSize?: number; lightweight?: boolean }): Promise<SchoolDataWithCreator[]> => {
    const queryParams: Record<string, string | number> = {};
    if (params?.page !== undefined) queryParams.page = params.page;
    if (params?.pageSize !== undefined) queryParams.pageSize = params.pageSize;
    queryParams.lightweight = params?.lightweight ? 'true' : 'false';
    return api.get<SchoolDataWithCreator[]>('/api/schools', queryParams);
  },

  getById: (id: string): Promise<SchoolDataWithCreator> =>
    api.get<SchoolDataWithCreator>(`/api/schools/${id}`),

  // Public requests (no authentication, always shows all schools)
  getAllPublic: (params?: { page?: number; pageSize?: number; lightweight?: boolean }): Promise<SchoolDataWithCreator[]> => {
    const queryParams: Record<string, string | number> = {};
    if (params?.page !== undefined) queryParams.page = params.page;
    if (params?.pageSize !== undefined) queryParams.pageSize = params.pageSize;
    queryParams.lightweight = params?.lightweight ? 'true' : 'false';
    return api.publicGet<SchoolDataWithCreator[]>('/api/schools', queryParams);
  },

  getByIdPublic: (id: string): Promise<SchoolDataWithCreator> =>
    api.publicGet<SchoolDataWithCreator>(`/api/schools/${id}`),

  create: (data: SchoolFormData): Promise<SchoolDataWithCreator> =>
    api.post<SchoolDataWithCreator>('/api/schools', data),

  update: (id: string, data: SchoolFormData): Promise<SchoolDataWithCreator> =>
    api.put<SchoolDataWithCreator>(`/api/schools/${id}`, data),

  delete: (id: string): Promise<{ message: string }> =>
    api.delete<{ message: string }>(`/api/schools/${id}`),
};
