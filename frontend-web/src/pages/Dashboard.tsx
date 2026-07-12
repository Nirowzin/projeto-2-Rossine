import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/Layout';

const Dashboard: React.FC = () => {
    const { user } = useAuth();

    return (
        <Layout>
            <div className="w-full max-w-4xl">
                <h1 className="mb-6 text-3xl font-bold">Dashboard</h1>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 shadow-md">
                        <h3 className="text-gray-400 text-sm mb-1">Seu Perfil</h3>
                        <p className="text-xl font-semibold">{user?.name}</p>
                        <span className="inline-block px-2 py-1 mt-2 text-xs rounded bg-blue-500/20 text-blue-300">
                            {user?.privilege_level === 1 ? 'Administrador' : user?.privilege_level === 2 ? 'Gerente' : 'Usuário Comum'}
                        </span>
                    </div>

                    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 shadow-md">
                        <h3 className="text-gray-400 text-sm mb-1">Status da Conta</h3>
                        <p className="text-xl font-semibold capitalize text-green-400">{user?.status}</p>
                    </div>

                    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 shadow-md">
                        <h3 className="text-gray-400 text-sm mb-1">Data de Cadastro</h3>
                        <p className="text-lg font-medium">{user?.created_at ? new Date(user.created_at).toLocaleDateString('pt-BR') : 'N/A'}</p>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Dashboard;
