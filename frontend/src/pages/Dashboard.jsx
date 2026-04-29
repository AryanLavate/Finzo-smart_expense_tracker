import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/useAuth';
import { transactionService } from '../services/transactionService';
import {
    LayoutDashboard,
    PlusCircle,
    LogOut,
    Wallet,
    Activity,
    MessageSquare,
    Calendar
} from 'lucide-react';
import SummaryCards from '../components/SummaryCards';
import TransactionForm from '../components/TransactionForm';
import Charts from '../components/Charts';
import HealthScore from '../components/HealthScore';
import Insights from '../components/Insights';

const Dashboard = ({ onNavigateToTransactions }) => {
    const { user, logout } = useAuth();
    const [transactions, setTransactions] = useState([]);
    const [healthScore, setHealthScore] = useState(null);
    const [classification, setClassification] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const [tData, hData, cData] = await Promise.all([
                transactionService.getTransactions(),
                transactionService.getHealthScore(),
                transactionService.getClassification()
            ]);
            setTransactions(tData);
            setHealthScore(hData);
            setClassification(cData);
        } catch (err) {
            console.error('Failed to fetch dashboard data', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const now = new Date();
    const defaultMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const [selectedMonthKey, setSelectedMonthKey] = useState(defaultMonthKey);

    const getAvailableMonths = () => {
        const keys = new Set();
        transactions.forEach((t) => {
            const d = new Date(t.date);
            keys.add(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
        });
        const sorted = Array.from(keys).sort((a, b) => b.localeCompare(a));
        if (sorted.length === 0) return [defaultMonthKey];
        if (!sorted.includes(defaultMonthKey)) sorted.unshift(defaultMonthKey);
        return sorted;
    };

    const availableMonths = getAvailableMonths();

    const selectedMonthTransactions = transactions.filter((t) => {
        const d = new Date(t.date);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        return key === selectedMonthKey;
    });

    const selectedMonthLabel = (() => {
        const [y, m] = selectedMonthKey.split('-');
        return new Date(parseInt(y), parseInt(m) - 1).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
    })();

    const handleTransactionAdded = () => {
        fetchData();
        setShowForm(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 dark:border-brand-accent"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-50">
            {/* Sidebar / Navigation */}
            <nav className="fixed top-0 left-0 right-0 h-20 bg-white/70 dark:bg-slate-900/50 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 z-40 px-8 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 dark:bg-brand-primary rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20 dark:shadow-brand-primary/20">
                        <Wallet className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">SmartExpense</span>
                </div>

                <div className="flex items-center gap-6">
                    <div className="hidden md:flex flex-col items-end">
                        <span className="text-sm font-medium text-slate-900 dark:text-white">{user.email}</span>
                        <span className="text-xs text-slate-500 dark:text-slate-500">Premium Account</span>
                    </div>
                    <button
                        onClick={logout}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                    >
                        <LogOut className="w-6 h-6" />
                    </button>
                </div>
            </nav>

            {/* Main Content */}
            <main className="pt-28 pb-16 px-4 md:px-8 max-w-7xl mx-auto space-y-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Financial Dashboard</h1>
                        <p className="text-slate-600 dark:text-slate-400 mt-1">Welcome back! Here's what's happening with your money.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={onNavigateToTransactions}
                            className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white px-6 py-3 rounded-xl font-semibold border border-slate-200 dark:border-slate-700 transition-all active:scale-95"
                        >
                            <Activity className="w-5 h-5 text-blue-500 dark:text-brand-accent" />
                            View All Transactions
                        </button>
                        <button
                            onClick={() => setShowForm(true)}
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 dark:bg-brand-primary dark:hover:bg-brand-accent text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-blue-600/20 dark:shadow-brand-primary/20 transition-all active:scale-95"
                        >
                            <PlusCircle className="w-5 h-5" />
                            Add Transaction
                        </button>
                    </div>
                </div>

                {/* Month Selector & Summary */}
                <div>
                    <div className="flex flex-wrap items-center gap-4 mb-4">
                        <label className="text-sm text-slate-500 dark:text-slate-400">Report for</label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                            <select
                                value={selectedMonthKey}
                                onChange={(e) => setSelectedMonthKey(e.target.value)}
                                className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 pl-10 pr-8 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-brand-accent/50 outline-none transition-all appearance-none"
                            >
                                {availableMonths.map((key) => {
                                    const [y, m] = key.split('-');
                                    const label = new Date(parseInt(y), parseInt(m) - 1).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
                                    return <option key={key} value={key}>{label}</option>;
                                })}
                            </select>
                        </div>
                    </div>
                    <SummaryCards transactions={selectedMonthTransactions} />
                </div>

                {/* Overall Report */}
                <div className="bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-3xl p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <LayoutDashboard className="w-5 h-5 text-blue-500 dark:text-brand-accent" />
                        Overall Transactions Report
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="p-4 bg-white dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                            <p className="text-slate-500 dark:text-slate-400">Total Transactions</p>
                            <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">{transactions.length}</p>
                        </div>
                        <div className="p-4 bg-white dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                            <p className="text-slate-500 dark:text-slate-400">All-Time Income</p>
                            <p className="text-xl font-bold text-emerald-500 mt-1">₹{transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0).toLocaleString()}</p>
                        </div>
                        <div className="p-4 bg-white dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                            <p className="text-slate-500 dark:text-slate-400">All-Time Expenses</p>
                            <p className="text-xl font-bold text-red-500 mt-1">₹{transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0).toLocaleString()}</p>
                        </div>
                        <div className="p-4 bg-white dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                            <p className="text-slate-500 dark:text-slate-400">Net Balance</p>
                            <p className="text-xl font-bold text-blue-500 dark:text-brand-accent mt-1">
                                ₹{(transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0) - transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0)).toLocaleString()}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="h-px bg-slate-200 dark:bg-slate-800" />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Analytics - Selected Month */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white/90 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm dark:shadow-none">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-semibold flex items-center gap-2">
                                    <Activity className="w-5 h-5 text-blue-500 dark:text-brand-accent" />
                                    Spending Trends ({selectedMonthLabel})
                                </h3>
                            </div>
                            <Charts transactions={selectedMonthTransactions} />
                        </div>

                        <div className="bg-white/90 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm dark:shadow-none">
                            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                                <MessageSquare className="w-5 h-5 text-emerald-500" />
                                Financial Insights ({selectedMonthLabel})
                            </h3>
                            <Insights transactions={selectedMonthTransactions} />
                        </div>
                    </div>

                    {/* Sidebar Analytics */}
                    <div className="space-y-8">
                        <HealthScore score={healthScore?.score} rating={healthScore?.rating} factors={healthScore?.factors} />

                        <div className="bg-white/90 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm dark:shadow-none">
                            <h3 className="text-lg font-semibold mb-4">User Classification</h3>
                            <div className="p-4 bg-blue-600/10 border border-blue-500/20 dark:bg-brand-primary/15 dark:border-brand-primary/30 rounded-2xl">
                                <span className="text-blue-400 dark:text-brand-secondary font-bold text-lg block mb-1">{classification?.category}</span>
                                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                                    {classification?.explanation}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Transaction Modal */}
            {showForm && (
                <TransactionForm
                    onClose={() => setShowForm(false)}
                    onSuccess={handleTransactionAdded}
                />
            )}
        </div>
    );
};

export default Dashboard;
