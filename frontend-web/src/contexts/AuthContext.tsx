import React, { createContext, useContext, useState, ReactNode } from 'react';
import axios from 'axios';

interface User {
    id: number;
    name: string;
    email: string;
    privilege_level: number;
    status: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (credentials: any) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api/v1',
});

// Garantir que o token salvo no F5/Reload continue acoplado no Axios
const initialToken = localStorage.getItem('token');
if (initialToken) {
    api.defaults.headers.Authorization = `Bearer ${initialToken}`;
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

    const login = async (credentials: any) => {
        try {
            const response = await api.post('/login', credentials);
            const { access_token } = response.data;
            setToken(access_token);
            localStorage.setItem('token', access_token);
            
            // Set default headers
            api.defaults.headers.Authorization = `Bearer ${access_token}`;
            
            // Fetch User Data
            const userResponse = await api.get('/me');
            setUser(userResponse.data);
        } catch (error: any) {
            if (error.response) {
                // Erro retornado pela API (Ex: 401 Unauthorized)
                throw new Error(error.response.data.error || 'Credenciais inválidas.');
            } else {
                // Erro de rede (API fora do ar)
                throw new Error('Erro de conexão com o servidor. A API backend está rodando?');
            }
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
        delete api.defaults.headers.Authorization;
    };

    return (
        <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
export { api };
