import React, { createContext, useState } from 'react';
import { api } from '../utils/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null);

    const login = async (email, password) => {
        const res = await api.post('/login', { email, password });
        setToken(res.data.token);
    };

    const register = async (name, email, password) => {
        await api.post('/register', { name, email, password });
    };

    const logout = () => setToken(null);

    return (
        <AuthContext.Provider value={{ token, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    );
};
