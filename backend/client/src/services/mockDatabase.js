const API_URL = '/api';

export const mockDatabase = {
    getProducts: async () => {
        const res = await fetch(`${API_URL}/products`);
        if (!res.ok) throw new Error('Failed to fetch products');
        return res.json();
    },

    getProductById: async (id) => {
        const res = await fetch(`${API_URL}/products/${id}`);
        if (!res.ok) throw new Error('Failed to fetch product');
        return res.json();
    },

    login: async (password) => {
        try {
            const res = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password })
            });

            const data = await res.json();

            if (!res.ok) {
                if (res.status === 401) {
                    throw new Error('Invalid credentials');
                }
                throw new Error(data.message || `Server error: ${res.status}`);
            }
            return data;
        } catch (error) {
            // If it's a fetch error (network down, server down), it won't have a response
            if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
                throw new Error('Cannot connect to server. Is the backend running?');
            }
            throw error;
        }
    },

    createOrder: async (orderData) => {
        const res = await fetch(`${API_URL}/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
        });
        if (!res.ok) throw new Error('Failed to create order');
        return res.json();
    },

    getOrders: async () => {
        const res = await fetch(`${API_URL}/orders`);
        if (!res.ok) throw new Error('Failed to fetch orders');
        return res.json();
    },

    updateOrder: async (id, updates) => {
        const res = await fetch(`${API_URL}/orders/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates)
        });
        if (!res.ok) throw new Error('Failed to update order');
        return res.json();
    },

    // Deprecated: Use updateOrder instead
    updateOrderStatus: async (id, status) => {
        return mockDatabase.updateOrder(id, { status });
    },

    deleteOrder: async (id) => {
        const res = await fetch(`${API_URL}/orders/${id}`, {
            method: 'DELETE'
        });
        if (!res.ok) throw new Error('Failed to delete order');
        return res.json();
    },

    createProduct: async (productData) => {
        const res = await fetch(`${API_URL}/products`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(productData)
        });
        if (!res.ok) throw new Error('Failed to create product');
        return res.json();
    },

    updateProduct: async (id, updates) => {
        const res = await fetch(`${API_URL}/products/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates)
        });
        if (!res.ok) throw new Error('Failed to update product');
        return res.json();
    },

    deleteProduct: async (id) => {
        const res = await fetch(`${API_URL}/products/${id}`, {
            method: 'DELETE'
        });
        if (!res.ok) throw new Error('Failed to delete product');
        return res.json();
    },

    getWilayas: async () => {
        const res = await fetch(`${API_URL}/wilayas`);
        if (!res.ok) throw new Error('Failed to fetch wilayas');
        return res.json();
    },

    addWilaya: async (wilayaData) => {
        const res = await fetch(`${API_URL}/wilayas`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(wilayaData)
        });
        if (!res.ok) throw new Error('Failed to add wilaya');
        return res.json();
    },

    deleteWilaya: async (id) => {
        const res = await fetch(`${API_URL}/wilayas/${id}`, {
            method: 'DELETE'
        });
        if (!res.ok) throw new Error('Failed to delete wilaya');
        return res.json();
    },

    getCoupons: async () => {
        const res = await fetch(`${API_URL}/coupons`);
        if (!res.ok) throw new Error('Failed to fetch coupons');
        return res.json();
    },

    createCoupon: async (couponData) => {
        const res = await fetch(`${API_URL}/coupons`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(couponData)
        });
        if (!res.ok) throw new Error('Failed to create coupon');
        return res.json();
    },

    deleteCoupon: async (id) => {
        const res = await fetch(`${API_URL}/coupons/${id}`, {
            method: 'DELETE'
        });
        if (!res.ok) throw new Error('Failed to delete coupon');
        return res.json();
    },

    validateCoupon: async (code) => {
        const res = await fetch(`${API_URL}/coupons/validate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code })
        });
        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message || 'Invalid coupon');
        }
        return res.json();
    }
};
