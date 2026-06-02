const API_URL = '/api';

const shop = {
    escapeHTML(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    },
    async fetchProducts() {
        const res = await fetch(`${API_URL}/products`);
        return await res.json();
    },
    async fetchProduct(id) {
        const res = await fetch(`${API_URL}/products/${id}`);
        return await res.json();
    },
    async login(email, password) {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (data.token) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
        }
        return data;
    },
    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = 'login.html';
    },
    getToken() {
        return localStorage.getItem('token');
    },
    getUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },
    async addToCart(productId, quantity = 1) {
        const token = this.getToken();
        if (!token) {
            alert('لطفا ابتدا وارد شوید');
            window.location.href = 'login.html';
            return;
        }
        const res = await fetch(`${API_URL}/carts/items`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ product_id: productId, quantity })
        });
        return await res.json();
    },
    async getCart() {
        const token = this.getToken();
        if (!token) return null;
        const res = await fetch(`${API_URL}/carts`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return await res.json();
    },
    async placeOrder(addressId) {
        const token = this.getToken();
        const res = await fetch(`${API_URL}/orders/from-cart`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ shipping_address_id: addressId, billing_address_id: addressId })
        });
        return await res.json();
    },
    async getMyOrders() {
        const token = this.getToken();
        const res = await fetch(`${API_URL}/orders/me`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return await res.json();
    }
};
