import { globalStore } from "@/store";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

interface RequestOptions {
  method?: HttpMethod;
  headers?: Record<string, string>;
  body?: any;
  params?: Record<string, string>;
}

type Res<T> = {
  code: number;
  data: T;
  msg: string;
};

class ApiClient {
  private static instance: ApiClient;

  private token: string = "";

  private baseUrl = "";

  private constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  public static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient("http://localhost:3000");
    }
    return ApiClient.instance;
  }

  public configuration = (token) => {
    this.token = token;
  };

  private request = async <T>(
    endpoint: string,
    options: RequestOptions = {}
  ) => {
    const { method = "GET", headers = {}, body, params } = options;

    const url = new URL(endpoint, this.baseUrl);

    // 处理查询参数
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }

    // 合并默认头部和自定义头部
    const defaultHeaders: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (this.token) {
      defaultHeaders["Authorization"] = `Bearer ${this.token}`;
    }

    const finalHeaders = { ...defaultHeaders, ...headers };

    try {
      const response = await fetch(url.toString(), {
        method,
        headers: finalHeaders,
        body: body ? JSON.stringify(body) : null,
      });

      if (response.status === 401) {
        globalStore.getState().handleLogout();
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // 尝试解析响应为 JSON，如果失败则返回原始文本
      const data = await response.json().catch(() => response.text());
      return data as Res<T>;
    } catch (error) {
      console.error("Request failed:", error);
      throw error;
    }
  };

  get<T>(endpoint: string, options?: Omit<RequestOptions, "method">) {
    return this.request<T>(endpoint, { ...options, method: "GET" });
  }

  post<T>(endpoint: string, options?: Omit<RequestOptions, "method">) {
    return this.request<T>(endpoint, { ...options, method: "POST" });
  }

  put<T>(endpoint: string, options?: Omit<RequestOptions, "method">) {
    return this.request<T>(endpoint, { ...options, method: "PUT" });
  }

  delete<T>(endpoint: string, options?: Omit<RequestOptions, "method">) {
    return this.request<T>(endpoint, { ...options, method: "DELETE" });
  }

  patch<T>(endpoint: string, options?: Omit<RequestOptions, "method">) {
    return this.request<T>(endpoint, { ...options, method: "PATCH" });
  }
}

const apiClient = ApiClient.getInstance();

export default apiClient;
