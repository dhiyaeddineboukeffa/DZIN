const API_URL = '/api';

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
            // Check if productData is FormData
            const isFormData = productData instanceof FormData;
            console.log('📤 Sending to:', `${API_URL}/products`);
            console.log('📋 Is FormData?', isFormData);

            const headers = isFormData ? {} : { 'Content-Type': 'application/json' };
            const body = isFormData ? productData : JSON.stringify(productData);

            console.log('🔍 Request details:', { method: 'POST', headers });

            const response = await fetch(`${API_URL}/products`, {
                method: 'POST',
                headers,
                body
            });

            console.log('📥 Response status:', response.status, response.statusText);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ Server error response:', errorText);
                throw new Error(`Failed to create product: ${response.status} - ${errorText}`);
            }

            return response.json();
        } catch (error) {
            console.error('❌ Fetch error details:', {
                message: error.message,
                name: error.name,
                stack: error.stack
            });
            throw error;
        }
    },
    updateProduct: async (id, productData) => {
        const isFormData = productData instanceof FormData;
        const headers = isFormData ? {} : { 'Content-Type': 'application/json' };
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
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to delete product');
        return response.json();
    },


    // Orders
    getOrders: async () => {
        const response = await fetch(`${API_URL}/orders`);
        if (!response.ok) throw new Error('Failed to fetch orders');
        return response.json();
    },
    updateOrder: async (id, updates) => {
        const response = await fetch(`${API_URL}/orders/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates)
        });
        if (!response.ok) throw new Error('Failed to update order');
        return response.json();
    },
    updateOrderStatus: async (id, status) => {
        const response = await fetch(`${API_URL}/orders/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status })
        });
        if (!response.ok) throw new Error('Failed to update status');
        return response.json();
    },
    deleteOrder: async (id) => {
        const response = await fetch(`${API_URL}/orders/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to delete order');
        return response.json();
    },

    // Wilayas
    addWilaya: async (wilayaData) => {
        const response = await fetch(`${API_URL}/wilayas`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(wilayaData)
        });
        if (!response.ok) throw new Error('Failed to add wilaya');
        return response.json();
    },
    deleteWilaya: async (id) => {
        const response = await fetch(`${API_URL}/wilayas/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to delete wilaya');
        return response.json();
    },

    // Coupons
    getCoupons: async () => {
        const response = await fetch(`${API_URL}/coupons`);
        if (!response.ok) throw new Error('Failed to fetch coupons');
        return response.json();
    },
    createCoupon: async (couponData) => {
        const response = await fetch(`${API_URL}/coupons`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(couponData)
        });
        if (!response.ok) throw new Error('Failed to create coupon');
        return response.json();
    },
    deleteCoupon: async (id) => {
        const response = await fetch(`${API_URL}/coupons/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to delete coupon');
        return response.json();
    }
};
