const API_URL = '/api';

const admin = {
    getToken() {
        return localStorage.getItem('token');
    },
    async fetchStats() {
        const res = await fetch(`${API_URL}/orders/stats`, {
            headers: { 'Authorization': `Bearer ${this.getToken()}` }
        });
        return await res.json();
    },
    async fetchProducts() {
        const res = await fetch(`${API_URL}/products`);
        return await res.json();
    },
    async createProduct(data) {
        const res = await fetch(`${API_URL}/products`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.getToken()}`
            },
            body: JSON.stringify(data)
        });
        return await res.json();
    },
    async fetchOrders() {
        const res = await fetch(`${API_URL}/orders`, {
            headers: { 'Authorization': `Bearer ${this.getToken()}` }
        });
        return await res.json();
    },
    async updateOrderStatus(id, status) {
        const res = await fetch(`${API_URL}/orders/${id}/status`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.getToken()}`
            },
            body: JSON.stringify({ status })
        });
        return await res.json();
    }
};
