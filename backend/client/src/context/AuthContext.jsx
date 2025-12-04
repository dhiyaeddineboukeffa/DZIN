import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockDatabase } from '../services/mockDatabase';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check for existing session
        const token = localStorage.getItem('dzin_token');
        if (token) {
            setUser({ role: 'admin' }); // Simplified session restoration
        }
        setIsLoading(false);
    }, []);

    const login = async (password) => {
        try {
            const response = await mockDatabase.login(password);
            localStorage.setItem('dzin_token', response.token);
            setUser({ role: response.role });
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const logout = () => {
        localStorage.removeItem('dzin_token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
