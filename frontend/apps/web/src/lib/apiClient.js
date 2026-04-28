const apiClient = {
    baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:3001',
    token: localStorage.getItem('authToken'),

    setToken(token) {
        this.token = token;
        if (token) {
            localStorage.setItem('authToken', token);
        } else {
            localStorage.removeItem('authToken');
        }
    },

    getHeaders() {
        const headers = {
            'Content-Type': 'application/json',
        };
        if (this.token) {
            headers.Authorization = `Bearer ${this.token}`;
        }
        return headers;
    },

    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const response = await fetch(url, {
            ...options,
            headers: {
                ...this.getHeaders(),
                ...options.headers,
            },
        });

        if (!response.ok) {
            const error = await response.json();
            throw error;
        }

        return response.json();
    },

    async signup(email, password, username) {
        const data = await this.request('/auth/signup', {
            method: 'POST',
            body: JSON.stringify({ email, password, username }),
        });
        if (data.token) {
            this.setToken(data.token);
        }
        return data;
    },

    async login(email, password) {
        const data = await this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
        if (data.token) {
            this.setToken(data.token);
        }
        return data;
    },

    async logout() {
        this.setToken(null);
        return this.request('/auth/logout', {
            method: 'POST',
        });
    },

    async getCurrentUser() {
        return this.request('/auth/me', {
            method: 'GET',
        });
    },

    // Content/TMDB API methods
    async getTrendingShows() {
        return this.request('/content/trending', {
            method: 'GET',
        });
    },

    async getPopularShows(page = 1) {
        return this.request(`/content/popular?page=${page}`, {
            method: 'GET',
        });
    },

    async getTopRatedShows(page = 1) {
        return this.request(`/content/top-rated?page=${page}`, {
            method: 'GET',
        });
    },

    async getShowDetails(showId) {
        return this.request(`/content/${showId}`, {
            method: 'GET',
        });
    },

    async searchShows(query, page = 1) {
        return this.request(`/content/search?query=${encodeURIComponent(query)}&page=${page}`, {
            method: 'GET',
        });
    },

    async getShowRecommendations(showId, page = 1) {
        return this.request(`/content/${showId}/recommendations?page=${page}`, {
            method: 'GET',
        });
    },
};

export default apiClient;
