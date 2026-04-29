import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Users, CreditCard, Activity, ArrowRight, ShieldCheck, UserCog, CheckCircle, XCircle, Trash2, LayoutDashboard, Settings } from 'lucide-react';

const AdminDashboard = ({ activeTab = 'all' }) => {
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [actionLoading, setActionLoading] = useState(null);
    const navigate = useNavigate();

    const fetchData = async () => {
        try {
            const [statsRes, usersRes] = await Promise.all([
                api.get('/admin/stats'),
                api.get('/admin/users')
            ]);
            setStats(statsRes.data);
            setUsers(usersRes.data);
        } catch (err) {
            setError('Failed to fetch admin data');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const toggleStatus = async (userId) => {
        setActionLoading(userId);
        try {
            await api.put(`/admin/users/${userId}/toggle-status`);
            await fetchData(); // Refresh data
        } catch (err) {
            alert(err.response?.data?.detail || 'Failed to toggle status');
        } finally {
            setActionLoading(null);
        }
    };

    const changeRole = async (userId, newRole) => {
        setActionLoading(userId);
        try {
            await api.put(`/admin/users/${userId}/role?role=${newRole}`);
            await fetchData(); // Refresh data
        } catch (err) {
            alert(err.response?.data?.detail || 'Failed to change role');
        } finally {
            setActionLoading(null);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-12 text-center">
                <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-2xl inline-block">
                    <p className="text-red-600 dark:text-red-400 font-medium">{error}</p>
                </div>
            </div>
        );
    }

    const showStats = activeTab === 'all' || activeTab === 'stats';
    const showUsers = activeTab === 'all' || activeTab === 'users';

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-3">
                    <div className="bg-blue-600 p-2 rounded-lg">
                        <ShieldCheck className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Admin Control Panel</h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">Manage users and monitor system performance</p>
                    </div>
                </div>

                <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                    <button
                        onClick={() => navigate('/admin')}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'all'
                                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-sm'
                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                            }`}
                    >
                        Overview
                    </button>
                    <button
                        onClick={() => navigate('/admin/stats')}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'stats'
                                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-sm'
                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                            }`}
                    >
                        Statistics
                    </button>
                    <button
                        onClick={() => navigate('/admin/users')}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'users'
                                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-sm'
                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                            }`}
                    >
                        Users
                    </button>
                </div>
            </div>

            {/* Stats Overview */}
            {showStats && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400">
                                <Users className="w-6 h-6" />
                            </div>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 font-medium uppercase tracking-wider">Total Users</p>
                        <h3 className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{stats.total_users}</h3>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg text-green-600 dark:text-green-400">
                                <CreditCard className="w-6 h-6" />
                            </div>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 font-medium uppercase tracking-wider">Total Transactions</p>
                        <h3 className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{stats.total_transactions}</h3>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-purple-600 dark:text-purple-400">
                                <Activity className="w-6 h-6" />
                            </div>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 font-medium uppercase tracking-wider">Total Volume</p>
                        <h3 className="text-3xl font-bold text-slate-900 dark:text-white mt-1">₹{stats.total_volume.toLocaleString()}</h3>
                    </div>
                </div>
            )}

            {/* User Management Section */}
            {showUsers && (
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                    <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                        <h2 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <Users className="w-5 h-5 text-blue-600" />
                            User Management
                        </h2>
                        {activeTab === 'all' && (
                            <button
                                onClick={() => navigate('/admin/users')}
                                className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-medium"
                            >
                                View Detailed List <ArrowRight className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 text-sm font-semibold uppercase tracking-wider">
                                <tr>
                                    <th className="px-6 py-4">User</th>
                                    <th className="px-6 py-4">Role</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                                {users.map((user) => (
                                    <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-slate-900 dark:text-slate-200 font-semibold">{user.full_name}</span>
                                                <span className="text-slate-500 dark:text-slate-400 text-sm">{user.email}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${user.role === 'admin'
                                                    ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                                                    : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                                }`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1.5">
                                                {user.is_active ? (
                                                    <>
                                                        <CheckCircle className="w-4 h-4 text-green-500" />
                                                        <span className="text-green-600 dark:text-green-400 text-sm font-medium">Active</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <XCircle className="w-4 h-4 text-red-500" />
                                                        <span className="text-red-600 dark:text-red-400 text-sm font-medium">Deactivated</span>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={() => changeRole(user.id, user.role === 'admin' ? 'user' : 'admin')}
                                                    disabled={actionLoading === user.id}
                                                    className="p-2 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-brand-accent transition-colors disabled:opacity-50"
                                                    title={user.role === 'admin' ? "Make User" : "Make Admin"}
                                                >
                                                    <UserCog className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => toggleStatus(user.id)}
                                                    disabled={actionLoading === user.id}
                                                    className={`p-2 transition-colors disabled:opacity-50 ${user.is_active
                                                            ? 'text-red-600 hover:text-red-700'
                                                            : 'text-green-600 hover:text-green-700'
                                                        }`}
                                                    title={user.is_active ? "Deactivate User" : "Activate User"}
                                                >
                                                    {user.is_active ? <XCircle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;


