import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
            setUser(JSON.parse(userInfo));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
        const { data } = await axios.post(`${baseUrl}/api/auth/login`, { email, password });
        setUser(data);
        localStorage.setItem('userInfo', JSON.stringify(data));
        return data;
    };

    const signup = async (name, email, password, phone) => {
        const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
        const { data } = await axios.post(`${baseUrl}/api/auth/signup`, { name, email, password, phone });
        return data;
    };

    const verifyOTP = async (email, otp) => {
        const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
        const { data } = await axios.post(`${baseUrl}/api/auth/verify`, { email, otp });
        setUser(data);
        localStorage.setItem('userInfo', JSON.stringify(data));
        return data;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('userInfo');
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, signup, verifyOTP, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
