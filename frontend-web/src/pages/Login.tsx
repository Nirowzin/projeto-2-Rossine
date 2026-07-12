import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await login({ email, password });
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.message || 'Erro ao realizar login');
        }
    };

    return (
        <div className="flex h-screen w-full items-center justify-center bg-gray-900 text-white">
            <div className="w-full max-w-md rounded-lg bg-gray-800 p-8 shadow-lg">
                <h1 className="mb-6 text-2xl font-bold text-center">Login</h1>
                
                {error && <div className="mb-4 text-sm text-red-500 bg-red-100/10 p-3 rounded">{error}</div>}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label className="mb-1 block text-sm font-medium">E-mail</label>
                        <input 
                            type="email" 
                            className="w-full rounded border border-gray-700 bg-gray-700 p-2 text-white outline-none focus:border-blue-500"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-medium">Senha</label>
                        <input 
                            type="password" 
                            className="w-full rounded border border-gray-700 bg-gray-700 p-2 text-white outline-none focus:border-blue-500"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center gap-2">
                            <input type="checkbox" className="rounded bg-gray-700" />
                            Lembrar-me
                        </label>
                        <a href="#" className="text-blue-400 hover:text-blue-300">Esqueci minha senha</a>
                    </div>
                    <button type="submit" className="mt-4 rounded bg-blue-600 p-2 font-bold hover:bg-blue-500 transition-colors">
                        Entrar
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
