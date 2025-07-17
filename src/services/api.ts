const getApiBase = () => {
    const baseUrl = import.meta.env.VITE_SOCKET_URL || window.location.origin;
    return `${baseUrl}/api`;
};

class ApiService {
    private token: string | null = null;

    setToken(token: string) {
        this.token = token;
        localStorage.setItem('admin_token', token);
    }

    getToken(): string | null {
        if (!this.token) {
            this.token = localStorage.getItem('admin_token');
        }
        return this.token;
    }

    clearToken() {
        this.token = null;
        localStorage.removeItem('admin_token');
    }

    private async request(endpoint: string, options: RequestInit = {}) {
        const token = this.getToken();
        const headers = new Headers({
            'Content-Type': 'application/json',
            ...(options.headers as Record<string, string>),
        });

        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }

        const response = await fetch(`${getApiBase()}${endpoint}`, {
            ...options,
            headers,
        });

        if (response.status === 401) {
            this.clearToken();
            window.location.href = '/admin/login';
            throw new Error('Unauthorized');
        }

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(
                errorData.message || `API Error: ${response.status}`
            );
        }

        const data = await response.json();

        if (data.success === false) {
            throw new Error(data.message || 'API request failed');
        }

        return data;
    }

    async login(username: string, password: string) {
        const response = await fetch(`${getApiBase()}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        return response.json();
    }

    async getAccounts() {
        return this.request('/accounts');
    }

    async deleteAccount(id: number | string) {
        return this.request(`/accounts/${id}`, {
            method: 'DELETE',
        });
    }

    async getAccount(username: string) {
        return this.request(`/accounts/${username}`);
    }

    async changePassword(newPassword: string) {
        return this.request('/admin/password', {
            method: 'PUT',
            body: JSON.stringify({ newPassword }),
        });
    }

    async get(endpoint: string) {
        return this.request(endpoint);
    }

    async post(endpoint: string, data: any) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async put(endpoint: string, data: any) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }
}

export const api = new ApiService();
