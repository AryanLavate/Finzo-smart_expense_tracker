import React, { useEffect, useState } from 'react';
import { getCurrentUser, loginUser, registerUser } from '../services/api';
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
                const userData = await getCurrentUser();
                setUser(userData);
                if (userData?.email) localStorage.setItem('userEmail', userData.email);
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
        const loginData = await loginUser(email, password);
        const { access_token } = loginData;
        localStorage.setItem('token', access_token);
        localStorage.setItem('userEmail', email);

        // Fetch full profile to get the role
        try {
            const userData = await getCurrentUser();
            setUser(userData);
        } catch {
            setUser({ email });
        }

        return loginData;
    };

    const register = async (email, password, fullName) => {
        return registerUser(email, password, fullName);
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
