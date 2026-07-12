import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { api, useAuth } from '../contexts/AuthContext';
import { Search, Edit, Trash2, Plus, ChevronLeft, ChevronRight, X } from 'lucide-react';

const Users: React.FC = () => {
    const { user: currentUser } = useAuth();
    const [users, setUsers] = useState<any[]>([]);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);

    // Modal forms states
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [formData, setFormData] = useState({
        name: '', email: '', password: '', password_confirmation: '', privilege_level: 3, status: 'active'
    });

    const loadUsers = async () => {
        setLoading(true);
        try {
            const response = await api.get('/users', {
                params: { search, page, per_page: 5, sort_by: 'code', sort_dir: 'asc' }
            });
            setUsers(response.data.data);
            setTotalPages(response.data.last_page);
        } catch (error) {
            console.error("Erro ao puxar usuários", error);
        }
        setLoading(false);
    };

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            loadUsers();
        }, 300);
        return () => clearTimeout(delayDebounceFn);
    }, [search, page]);

    const handleDelete = async (id: number) => {
        if (!window.confirm("Certeza absoluta que deseja excluir este registro?")) return;
        try {
            await api.delete(`/users/${id}`);
            loadUsers();
        } catch (error: any) {
            alert(error.response?.data?.error || "Acesso negado ou erro ao excluir.");
        }
    };

    const openModal = (user: any = null) => {
        if (user) {
            setFormData({ 
                name: user.name, 
                email: user.email, 
                password: '', 
                password_confirmation: '', 
                privilege_level: user.privilege_level, 
                status: user.status 
            });
            setEditingId(user.code);
        } else {
            setFormData({ 
                name: '', email: '', password: '', password_confirmation: '', privilege_level: 3, status: 'active' 
            });
            setEditingId(null);
        }
        setShowModal(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = { ...formData };
            // Na Edição, se não mudou a senha remove do payload
            if (!payload.password) {
                delete payload.password;
                delete payload.password_confirmation;
            }

            if (editingId) {
                await api.put(`/users/${editingId}`, payload);
            } else {
                await api.post('/users', payload);
            }
            setShowModal(false);
            loadUsers();
        } catch (error: any) {
            // Em caso de erro do Laravel (Validation Exception 422), captura o objeto message
            const errorMsg = error.response?.data?.message || error.response?.data?.error || "Erro desconhecido ao salvar.";
            alert(errorMsg);
        }
    };

    return (
        <Layout>
            <div className="flex flex-col h-full relative">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">Gestão de Usuários</h1>
                    {currentUser?.privilege_level !== 3 && (
                        <button onClick={() => openModal()} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded font-medium transition-colors">
                            <Plus size={18} /> Novo Usuário
                        </button>
                    )}
                </div>

                <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-md flex-1 flex flex-col">
                    <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                        <div className="relative w-72">
                            <Search className="absolute left-3 top-2.5 text-gray-500" size={18} />
                            <input 
                                type="text" 
                                placeholder="Pesquisa instantânea..." 
                                value={search}
                                onChange={(e) => {setSearch(e.target.value); setPage(1);}}
                                className="w-full bg-gray-900 border border-gray-700 rounded py-2 pl-10 pr-3 focus:outline-none focus:border-blue-500 text-sm"
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-auto">
                        <table className="w-full text-left text-sm text-gray-300">
                            <thead className="bg-gray-900/50 text-gray-400 sticky top-0">
                                <tr>
                                    <th className="p-4 font-medium">Código</th>
                                    <th className="p-4 font-medium">Nome</th>
                                    <th className="p-4 font-medium">E-mail</th>
                                    <th className="p-4 font-medium">Nível</th>
                                    <th className="p-4 font-medium">Status</th>
                                    <th className="p-4 font-medium text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan={6} className="p-8 text-center text-gray-500">Carregando dados...</td></tr>
                                ) : users.map(user => (
                                    <tr key={user.code} className="border-b border-gray-700/50 hover:bg-gray-700/20">
                                        <td className="p-4">#{user.code}</td>
                                        <td className="p-4 font-medium text-white">{user.name}</td>
                                        <td className="p-4">{user.email}</td>
                                        <td className="p-4">
                                            {user.privilege_level === 1 && <span className="text-purple-400 font-medium">Administrador</span>}
                                            {user.privilege_level === 2 && <span className="text-blue-400 font-medium">Gerente</span>}
                                            {user.privilege_level === 3 && <span className="text-gray-400">Comum</span>}
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 text-xs rounded-full ${user.status === 'active' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-500'}`}>
                                                {user.status === 'active' ? 'Ativo' : 'Inativo'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                {currentUser?.privilege_level !== 3 && (
                                                    <button onClick={() => openModal(user)} className="p-1.5 text-gray-400 hover:text-blue-400 hover:bg-gray-700 rounded transition-colors" title="Editar">
                                                        <Edit size={16} />
                                                    </button>
                                                )}
                                                {currentUser?.privilege_level !== 3 && (
                                                    <button onClick={() => handleDelete(user.code)} className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-gray-700 rounded transition-colors" title="Excluir">
                                                        <Trash2 size={16} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {!loading && users.length === 0 && (
                                    <tr><td colSpan={6} className="p-8 text-center text-gray-500">Nenhum registro encontrado buscando por "{search}".</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="p-4 border-t border-gray-700 flex justify-between items-center text-sm text-gray-400">
                        <span>Página {page} de {totalPages || 1}</span>
                        <div className="flex gap-2">
                            <button disabled={page === 1} onClick={() => setPage(page - 1)} className="p-1.5 rounded border border-gray-600 hover:bg-gray-700 disabled:opacity-50 disabled:hover:bg-transparent transition-colors">
                                <ChevronLeft size={18} />
                            </button>
                            <button disabled={page >= totalPages} onClick={() => setPage(page + 1)} className="p-1.5 rounded border border-gray-600 hover:bg-gray-700 disabled:opacity-50 disabled:hover:bg-transparent transition-colors">
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* MODAL DE CRIAÇÃO / EDIÇÃO */}
                {showModal && (
                    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm">
                        <div className="bg-gray-800 border border-gray-700 rounded-lg w-full max-w-lg p-7 shadow-2xl">
                            
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-white">{editingId ? '✏️ Editar Usuário' : '✨ Novo Cadastro'}</h2>
                                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white p-1 hover:bg-gray-700 rounded transition-colors"><X size={20}/></button>
                            </div>
                            
                            <form onSubmit={handleSave} className="flex flex-col gap-5">
                                <div>
                                    <label className="text-sm text-gray-300 font-medium mb-1 block">Nome Completo</label>
                                    <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-gray-900 border border-gray-600 rounded p-2.5 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all outline-none" placeholder="Ex: Roberto Silva"/>
                                </div>
                                
                                <div>
                                    <label className="text-sm text-gray-300 font-medium mb-1 block">Endereço de E-mail</label>
                                    <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-gray-900 border border-gray-600 rounded p-2.5 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all outline-none" placeholder="roberto@empresa.com"/>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4 border-t border-gray-700 pt-4 mt-2">
                                    <div>
                                        <label className="text-sm text-gray-300 font-medium mb-1 block">Senha {editingId && <span className="text-xs text-gray-500 font-normal">(vazio p/ manter)</span>}</label>
                                        <input type="password" required={!editingId} minLength={6} value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full bg-gray-900 border border-gray-600 rounded p-2.5 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all outline-none" placeholder="••••••"/>
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-300 font-medium mb-1 block">Confirmar Senha</label>
                                        <input type="password" required={!editingId && !!formData.password} minLength={6} value={formData.password_confirmation} onChange={e => setFormData({...formData, password_confirmation: e.target.value})} className="w-full bg-gray-900 border border-gray-600 rounded p-2.5 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all outline-none" placeholder="••••••"/>
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm text-gray-300 font-medium mb-1 block">Nível de Acesso</label>
                                        <select value={formData.privilege_level} onChange={e => setFormData({...formData, privilege_level: Number(e.target.value)})} className="w-full bg-gray-900 border border-gray-600 rounded p-2.5 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all outline-none">
                                            {/* Impedir que outros criem Administrador se não forem Administradores */}
                                            {currentUser?.privilege_level === 1 && <option value={1}>1 - Administrador</option>}
                                            <option value={2}>2 - Gerente</option>
                                            <option value={3}>3 - Usuário Comum</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-300 font-medium mb-1 block">Status</label>
                                        <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full bg-gray-900 border border-gray-600 rounded p-2.5 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all outline-none">
                                            <option value="active">🟢 Ativo</option>
                                            <option value="inactive">🔴 Inativo</option>
                                        </select>
                                    </div>
                                </div>
                                
                                <div className="mt-6 flex justify-end gap-3 border-t border-gray-700 pt-5">
                                    <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2 rounded text-gray-300 hover:bg-gray-700 font-medium transition-colors">
                                        Cancelar
                                    </button>
                                    <button type="submit" className="px-5 py-2 rounded bg-blue-600 hover:bg-blue-500 font-bold text-white shadow-lg transition-colors">
                                        Salvar Registro
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default Users;
