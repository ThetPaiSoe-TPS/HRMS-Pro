import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import axios from "axios";
import type { ApiResponse } from "../types/api.types";


class ApiService {
  private api: AxiosInstance;

  constructor() {
    // Use environment variable for API URL
    const apiUrl =
      import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

    this.api = axios.create({
      baseURL: apiUrl,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    // Request interceptor
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("auth_token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error),
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem("auth_token");
          localStorage.removeItem("user");
          window.location.href = "/login";
        }
        return Promise.reject(error);
      },
    );
  }

  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<ApiResponse<T>> = await this.api.get(
      url,
      config,
    );
    return response.data.data;
  }

  public async post<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response: AxiosResponse<ApiResponse<T>> = await this.api.post(
      url,
      data,
      config,
    );
    return response.data.data;
  }

  public async put<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response: AxiosResponse<ApiResponse<T>> = await this.api.put(
      url,
      data,
      config,
    );
    return response.data.data;
  }

  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<ApiResponse<T>> = await this.api.delete(
      url,
      config,
    );
    return response.data.data;
  }

  public async patch<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response: AxiosResponse<ApiResponse<T>> = await this.api.patch(
      url,
      data,
      config,
    );
    return response.data.data;
  }
}

// Helper function to get storage URL
export const getStorageUrl = (path: string | null): string | null => {
  if (!path) return null;
  if (path.startsWith("http")) return path;

  const storageUrl =
    import.meta.env.VITE_STORAGE_URL || "http://localhost:8000/storage";
  return `${storageUrl}/${path}`;
};

export const api = new ApiService();
export default api;
