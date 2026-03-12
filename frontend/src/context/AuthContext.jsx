import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('access_token'));
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const isAuthenticated = !!token;

    useEffect(() => {
        if (token) {
            try {
                const payloadBase64 = token.split('.')[1];
                const decodedJson = atob(payloadBase64);
                const decoded = JSON.parse(decodedJson);
                setUser({ email: decoded.sub, name: decoded.name || decoded.sub });
            } catch (error) {
                console.error('Failed to decode token', error);
                logout();
            }
        } else {
            setUser(null);
        }
        setLoading(false);
    }, [token]);

    const login = (tokenData) => {
        const accessToken = tokenData.access_token;
        localStorage.setItem('access_token', accessToken);
        setToken(accessToken);
        
        try {
            const payloadBase64 = accessToken.split('.')[1];
            const decodedJson = atob(payloadBase64);
            const decoded = JSON.parse(decodedJson);
            setUser({ email: decoded.sub, name: decoded.name || decoded.sub });
        } catch (error) {
            console.error('Failed to decode token', error);
        }
    };

    const logout = () => {
        localStorage.removeItem('access_token');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, isAuthenticated, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
