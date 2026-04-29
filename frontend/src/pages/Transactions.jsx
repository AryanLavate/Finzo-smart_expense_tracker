import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { transactionService } from '../services/transactionService';
import TransactionForm from '../components/TransactionForm';
import {
    ArrowLeft,
    Trash2,
    Search,
    Filter,
    TrendingUp,
    TrendingDown,
    Calendar,
    Tag,
    Edit
} from 'lucide-react';

const Transactions = ({ onBack }) => {
    const navigate = useNavigate();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [selectedMonth, setSelectedMonth] = useState('all');
    const [showForm, setShowForm] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState(null);

    const fetchTransactions = async () => {
        try {
            const data = await transactionService.getTransactions();
            setTransactions(data.sort((a, b) => new Date(b.date) - new Date(a.date)));
        } catch (err) {
            console.error('Failed to fetch transactions', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this transaction?')) {
            try {
                await transactionService.deleteTransaction(id);
                setTransactions(transactions.filter(t => t.id !== id));
            } catch (e) {
                console.error('Failed to delete transaction', e);
                alert('Failed to delete transaction');
            }
        }
    };

    const handleEdit = (transaction) => {
        setEditingTransaction(transaction);
        setShowForm(true);
    };

    const handleFormClose = () => {
        setShowForm(false);
        setEditingTransaction(null);
    };

    const handleFormSuccess = () => {
        setShowForm(false);
        setEditingTransaction(null);
        fetchTransactions();
    };

    const filteredTransactions = transactions.filter(t => {
        const matchesSearch = t.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.category.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterType === 'all' || t.type === filterType;
        return matchesSearch && matchesFilter;
    });

    // Build list of available months for selector
    const getAvailableMonths = () => {
        const keys = new Set();
        filteredTransactions.forEach((t) => {
            const d = new Date(t.date);
            keys.add(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
        });
        return Array.from(keys).sort((a, b) => b.localeCompare(a));
    };

    const availableMonths = getAvailableMonths();

    const monthFilteredTransactions = selectedMonth === 'all'
        ? filteredTransactions
        : filteredTransactions.filter((t) => {
            const d = new Date(t.date);
            const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
            return key === selectedMonth;
        });

    // Group transactions by month (year-month)
    const groupByMonth = (txns) => {
        const groups = {};
        txns.forEach((t) => {
            const d = new Date(t.date);
            const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
            const label = d.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
            if (!groups[key]) groups[key] = { label, transactions: [] };
            groups[key].transactions.push(t);
        });
        return Object.entries(groups).sort((a, b) => b[0].localeCompare(a[0]));
    };

    const transactionsByMonth = groupByMonth(monthFilteredTransactions);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 dark:border-brand-accent"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-50 pt-28 pb-12 px-4 md:px-8 max-w-7xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={onBack || (() => navigate('/dashboard'))}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">All Transactions</h1>
                    <p className="text-slate-600 dark:text-slate-400 mt-1">Manage and track your financial history</p>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="relative md:col-span-2">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input
                        type="text"
                        placeholder="Search by description or category..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl py-3 pl-12 pr-4 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-brand-accent/50 outline-none transition-all"
                    />
                </div>
                <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <select
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl py-3 pl-12 pr-4 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-brand-accent/50 outline-none transition-all appearance-none"
                    >
                        <option value="all">All Months</option>
                        {availableMonths.map((key) => {
                            const [y, m] = key.split('-');
                            const label = new Date(parseInt(y), parseInt(m) - 1).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
                            return <option key={key} value={key}>{label}</option>;
                        })}
                    </select>
                </div>
                <div className="relative">
                    <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl py-3 pl-12 pr-4 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-brand-accent/50 outline-none transition-all appearance-none"
                    >
                        <option value="all">All Types</option>
                        <option value="income">Income Only</option>
                        <option value="expense">Expenses Only</option>
                    </select>
                </div>
            </div>

            {/* Transactions by Month */}
            <div className="space-y-8">
                {transactionsByMonth.length === 0 ? (
                    <div className="bg-white/90 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center text-slate-500 italic">
                        No transactions found matching your criteria.
                    </div>
                ) : (
                    transactionsByMonth.map(([key, { label, transactions: monthTxns }]) => (
                        <div key={key} className="bg-white/90 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm dark:shadow-none">
                            <div className="bg-slate-100 dark:bg-slate-800/80 px-6 py-4 border-b border-slate-200 dark:border-slate-700">
                                <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                    <Calendar className="w-5 h-5 text-blue-500 dark:text-brand-accent" />
                                    {label}
                                    <span className="text-sm font-normal text-slate-500 dark:text-slate-400">
                                        ({monthTxns.length} transaction{monthTxns.length !== 1 ? 's' : ''})
                                    </span>
                                </h2>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-slate-50 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800">
                                            <th className="px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Date</th>
                                            <th className="px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Description</th>
                                            <th className="px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Category</th>
                                            <th className="px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Amount</th>
                                            <th className="px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                                        {monthTxns.map((t) => (
                                            <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                                                        <Calendar className="w-4 h-4 text-slate-500" />
                                                        {new Date(t.date).toLocaleDateString()}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-slate-900 dark:text-white font-medium">{t.description || 'No description'}</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <Tag className="w-4 h-4 text-blue-500 dark:text-brand-accent" />
                                                        <span className="bg-blue-500/10 text-blue-400 dark:bg-brand-accent/10 dark:text-brand-secondary px-3 py-1 rounded-full text-xs font-bold">
                                                            {t.category}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-1 font-bold">
                                                        {t.type === 'income' ? (
                                                            <TrendingUp className="w-4 h-4 text-emerald-500" />
                                                        ) : (
                                                            <TrendingDown className="w-4 h-4 text-red-500" />
                                                        )}
                                                        <span className={t.type === 'income' ? 'text-emerald-500' : 'text-red-500'}>
                                                            {t.type === 'income' ? '+' : '-'}₹{t.amount.toLocaleString()}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100">
                                                        <button
                                                            onClick={() => handleEdit(t)}
                                                            className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-500/10 dark:hover:text-brand-secondary dark:hover:bg-brand-primary/20 rounded-lg transition-all"
                                                        >
                                                            <Edit className="w-5 h-5" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(t.id)}
                                                            className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-500/10 rounded-lg transition-all"
                                                        >
                                                            <Trash2 className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {showForm && (
                <TransactionForm
                    onClose={handleFormClose}
                    onSuccess={handleFormSuccess}
                    transaction={editingTransaction}
                />
            )}
        </div>
    );
};

export default Transactions;
