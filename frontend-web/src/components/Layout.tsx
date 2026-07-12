import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, LogOut } from 'lucide-react';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { logout, user } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="flex h-screen w-full bg-gray-900 text-white font-sans overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-800 flex flex-col border-r border-gray-700">
                <div className="p-6 border-b border-gray-700">
                    <h1 className="text-2xl font-bold text-blue-500">ERP System</h1>
                    <p className="text-xs text-gray-400 mt-1">{user?.name}</p>
                </div>
                
                <nav className="flex-1 p-4 space-y-2">
                    <NavLink 
                        to="/dashboard" 
                        className={({ isActive }) => `flex items-center gap-3 p-3 rounded transition-colors ${isActive ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-700 hover:text-white'}`}
                    >
                        <LayoutDashboard size={20} />
                        <span>Dashboard</span>
                    </NavLink>
                    <NavLink 
                        to="/users" 
                        className={({ isActive }) => `flex items-center gap-3 p-3 rounded transition-colors ${isActive ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-700 hover:text-white'}`}
                    >
                        <Users size={20} />
                        <span>Usuários</span>
                    </NavLink>
                </nav>

                <div className="p-4 border-t border-gray-700">
                    <button 
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 p-3 rounded text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                        <LogOut size={20} />
                        <span>Sair da conta</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto flex flex-col">
                <header className="h-16 bg-gray-800 border-b border-gray-700 flex items-center px-8 shadow-sm">
                    <h2 className="font-medium text-gray-300">
                        Painel de Administração
                    </h2>
                </header>
                <div className="p-8 flex-1">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Layout;