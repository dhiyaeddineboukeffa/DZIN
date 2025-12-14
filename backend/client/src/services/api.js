const API_URL = '/api';

const getAuthHeaders = () => {
    const token = localStorage.getItem('dzin_token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const api = {
    // Wilayas
    getWilayas: async () => {
        const response = await fetch(`${API_URL}/wilayas`);
        if (!response.ok) throw new Error('Failed to fetch wilayas');
        return response.json();
    },

    // Coupons
    validateCoupon: async (code) => {
        const response = await fetch(`${API_URL}/coupons/validate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code })
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Invalid coupon');
        }
        return data;
    },

    // Orders
    createOrder: async (orderData) => {
        const response = await fetch(`${API_URL}/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Failed to create order');
        }
        return data;
    },

    // Products
    getProducts: async () => {
        const response = await fetch(`${API_URL}/products`);
        if (!response.ok) throw new Error('Failed to fetch products');
        return response.json();
    },
    getProductById: async (id) => {
        const response = await fetch(`${API_URL}/products/${id}`);
        if (!response.ok) throw new Error('Product not found');
        return response.json();
    },
    createProduct: async (productData) => {
        try {
            const isFormData = productData instanceof FormData;
            const headers = {
                ...getAuthHeaders(),
                ...(isFormData ? {} : { 'Content-Type': 'application/json' })
            };
            const body = isFormData ? productData : JSON.stringify(productData);

            const response = await fetch(`${API_URL}/products`, {
                method: 'POST',
                headers,
                body
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to create product: ${response.status} - ${errorText}`);
            }

            return response.json();
        } catch (error) {
            console.error('Fetch error:', error);
            throw error;
        }
    },
    updateProduct: async (id, productData) => {
        const isFormData = productData instanceof FormData;
        const headers = {
            ...getAuthHeaders(),
            ...(isFormData ? {} : { 'Content-Type': 'application/json' })
        };
        const body = isFormData ? productData : JSON.stringify(productData);

        const response = await fetch(`${API_URL}/products/${id}`, {
            method: 'PUT',
            headers,
            body
        });
        if (!response.ok) throw new Error('Failed to update product');
        return response.json();
    },
    deleteProduct: async (id) => {
        const response = await fetch(`${API_URL}/products/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        if (!response.ok) throw new Error('Failed to delete product');
        return response.json();
    },


    // Orders
    getOrders: async () => {
        const response = await fetch(`${API_URL}/orders`, {
            headers: getAuthHeaders()
        });
        if (!response.ok) throw new Error('Failed to fetch orders');
        return response.json();
    },
    updateOrder: async (id, updates) => {
        const response = await fetch(`${API_URL}/orders/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeaders()
            },
            body: JSON.stringify(updates)
        });
        if (!response.ok) throw new Error('Failed to update order');
        return response.json();
    },
    updateOrderStatus: async (id, status) => {
        const response = await fetch(`${API_URL}/orders/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeaders()
            },
            body: JSON.stringify({ status })
        });
        if (!response.ok) throw new Error('Failed to update status');
        return response.json();
    },
    deleteOrder: async (id) => {
        const response = await fetch(`${API_URL}/orders/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        if (!response.ok) throw new Error('Failed to delete order');
        return response.json();
    },

    // Wilayas
    addWilaya: async (wilayaData) => {
        const response = await fetch(`${API_URL}/wilayas`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeaders()
            },
            body: JSON.stringify(wilayaData)
        });
        if (!response.ok) throw new Error('Failed to add wilaya');
        return response.json();
    },
    deleteWilaya: async (id) => {
        const response = await fetch(`${API_URL}/wilayas/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        if (!response.ok) throw new Error('Failed to delete wilaya');
        return response.json();
    },

    // Coupons
    getCoupons: async () => {
        const response = await fetch(`${API_URL}/coupons`, {
            headers: getAuthHeaders()
        });
        if (!response.ok) throw new Error('Failed to fetch coupons');
        return response.json();
    },
    createCoupon: async (couponData) => {
        const response = await fetch(`${API_URL}/coupons`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeaders()
            },
            body: JSON.stringify(couponData)
        });
        if (!response.ok) throw new Error('Failed to create coupon');
        return response.json();
    },
    deleteCoupon: async (id) => {
        const response = await fetch(`${API_URL}/coupons/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        if (!response.ok) throw new Error('Failed to delete coupon');
        return response.json();
    },

    // Settings
    getSetting: async (key) => {
        const response = await fetch(`${API_URL}/settings/${key}`);
        if (!response.ok) throw new Error('Failed to fetch setting');
        return response.json();
    },
    updateSetting: async (key, value) => {
        const response = await fetch(`${API_URL}/settings/${key}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeaders()
            },
            body: JSON.stringify({ value })
        });
        if (!response.ok) throw new Error('Failed to update setting');
        return response.json();
    }
};
