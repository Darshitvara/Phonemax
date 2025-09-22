// Prefer Vite env for API base URL; fallback to common local backend port (5000)
const API_BASE_URL = import.meta?.env?.VITE_API_BASE_URL || 'https://phonemax.onrender.com';

// Get auth token from localStorage
const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

// Set auth token in localStorage
export const setAuthToken = (token: string): void => {
  localStorage.setItem('authToken', token);
};

// Remove auth token from localStorage
export const removeAuthToken = (): void => {
  localStorage.removeItem('authToken');
};

// Create fetch-based API client
class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request(endpoint: string, options: RequestInit = {}): Promise<any> {
    const url = `${this.baseURL}${endpoint}`;
    const token = getAuthToken();

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      let response = await fetch(url, config);

      // Auto-retry once with '/api' prefix if baseURL likely missed it and we got a 404
      const alreadyRetried = (options as any)._retriedWithApi === true;
      if (
        response.status === 404 &&
        !alreadyRetried &&
        !this.baseURL.includes('/api') &&
        !endpoint.startsWith('/api')
      ) {
        const newBase = this.baseURL.replace(/\/$/, '') + '/api';
        const retryUrl = `${newBase}${endpoint}`;
        const retryOptions: RequestInit = { ...config, headers: { ...(config.headers || {}), 'X-Retry-With-Api': '1' } };
        (retryOptions as any)._retriedWithApi = true;
        response = await fetch(retryUrl, retryOptions);
      }
      const contentType = response.headers.get('content-type') || '';
      let data: any = null;
      if (contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        if (!response.ok) {
          const snippet = text.slice(0, 200).replace(/\s+/g, ' ').trim();
          throw new Error(`API ${response.status} ${response.statusText}: ${snippet}`);
        }
        // Unexpected non-JSON success; return raw text
        return text;
      }

      if (!response.ok) {
        // Surface backend error details if present
        const msg = (data && (data.error || data.message)) || `API request failed (${response.status})`;
        throw new Error(msg);
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  async get(endpoint: string): Promise<any> {
    return this.request(endpoint, { method: 'GET' });
  }

  async post(endpoint: string, data: any): Promise<any> {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put(endpoint: string, data: any): Promise<any> {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async patch(endpoint: string, data: any): Promise<any> {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async delete(endpoint: string, data?: any): Promise<any> {
    const options: RequestInit = { method: 'DELETE' };
    if (data !== undefined) {
      (options as any).body = JSON.stringify(data);
    }
    return this.request(endpoint, options);
  }
}

export const api = new ApiClient(API_BASE_URL);