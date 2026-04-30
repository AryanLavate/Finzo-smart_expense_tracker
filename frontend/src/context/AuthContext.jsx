import React, { useEffect, useState } from 'react';
import api from '../services/api';
import AuthContext from './authContext';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const bootstrap = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setUser(null);
                setLoading(false);
                return;
            }

            try {
                // Verify token server-side and get user profile
                const res = await api.get('/auth/me');
                setUser(res.data);
                if (res.data?.email) localStorage.setItem('userEmail', res.data.email);
            } catch {
                localStorage.removeItem('token');
                localStorage.removeItem('userEmail');
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        bootstrap();
    }, []);

    const login = async (email, password) => {
        // Use x-www-form-urlencoded so FastAPI's OAuth2PasswordRequestForm can parse it reliably
        const formData = new URLSearchParams();
        formData.append('username', email);
        formData.append('password', password);

        const response = await api.post('/auth/login', formData, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        });
        const { access_token } = response.data;
        localStorage.setItem('token', access_token);
        localStorage.setItem('userEmail', email);

        // Fetch full profile to get the role
        try {
            const res = await api.get('/auth/me');
            setUser(res.data);
        } catch {
            setUser({ email });
        }

        return response.data;
    };

    const register = async (email, password, fullName) => {
        const response = await api.post('/auth/register', {
            email,
            password,
            full_name: fullName,
        }, {
            headers: { 'Content-Type': 'application/json' },
        });
        return response.data;
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userEmail');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{
            user,
            login,
            register,
            logout,
            loading,
            isAdmin: user?.role === 'admin'
        }}>
            {children}
        </AuthContext.Provider>
    );
};
