import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, IndianRupee, Tag, FileText, Calendar } from 'lucide-react';
import { transactionService } from '../services/transactionService';

const TransactionForm = ({ onClose, onSuccess, transaction = null }) => {
    const isUpdateMode = !!transaction;

    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');
    const [type, setType] = useState('expense');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [loading, setLoading] = useState(false);

    // Pre-populate form when editing
    useEffect(() => {
        if (transaction) {
            setAmount(transaction.amount.toString());
            setCategory(transaction.category);
            setType(transaction.type);
            setDescription(transaction.description || '');
            // Convert datetime to date input format (YYYY-MM-DD)
            if (transaction.date) {
                const dateObj = new Date(transaction.date);
                const formattedDate = dateObj.toISOString().split('T')[0];
                setDate(formattedDate);
            }
        }
    }, [transaction]);

    const categories = type === 'income'
        ? ['Salary', 'Freelance', 'Investment', 'Gift', 'Other']
        : ['Food', 'Rent', 'Bills', 'Entertainment', 'Shopping', 'Transport', 'Other'];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const transactionData = {
                amount: parseFloat(amount),
                category,
                type,
                description: description || null,
                ...(date ? { date: new Date(date + 'T12:00:00').toISOString() } : {})
            };

            if (isUpdateMode) {
                await transactionService.updateTransaction(transaction.id, transactionData);
            } else {
                await transactionService.createTransaction(transactionData);
            }
            onSuccess();
        } catch (err) {
            console.error(`Failed to ${isUpdateMode ? 'update' : 'add'} transaction`, err);
            const msg = err?.response?.data?.detail;
            const detail = typeof msg === 'string' ? msg : (Array.isArray(msg) ? msg.map(e => e.msg || JSON.stringify(e)).join(', ') : JSON.stringify(msg || ''));
            alert(`Failed to ${isUpdateMode ? 'update' : 'add'} transaction. ${detail || 'Please try again.'}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-950/40 dark:bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                        {isUpdateMode ? 'Update Transaction' : 'Add New Transaction'}
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-400 transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Type Selector */}
                    <div className="flex p-1 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800">
                        {(!isUpdateMode || type === 'expense') && (
                            <button
                                type="button"
                                onClick={() => { setType('expense'); setCategory(''); }}
                                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition-all ${type === 'expense' ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'text-slate-400 hover:text-white'
                                    }`}
                            >
                                <Minus className="w-4 h-4" />
                                Expense
                            </button>
                        )}
                        {(!isUpdateMode || type === 'income') && (
                            <button
                                type="button"
                                onClick={() => { setType('income'); setCategory(''); }}
                                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition-all ${type === 'income' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'text-slate-400 hover:text-white'
                                    }`}
                            >
                                <Plus className="w-4 h-4" />
                                Income
                            </button>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-600 dark:text-slate-400 ml-1">Amount</label>
                            <div className="relative">
                                <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                                <input
                                    type="number"
                                    required
                                    step="0.01"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-3 pl-12 pr-4 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 dark:focus:ring-brand-accent/50 dark:focus:border-brand-accent outline-none transition-all"
                                    placeholder="0.00"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-600 dark:text-slate-400 ml-1">Category</label>
                            <div className="relative">
                                <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                                <select
                                    required
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-3 pl-12 pr-4 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 dark:focus:ring-brand-accent/50 dark:focus:border-brand-accent outline-none transition-all appearance-none"
                                >
                                    <option value="" disabled>Select category</option>
                                    {categories.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-600 dark:text-slate-400 ml-1">Date (Optional)</label>
                        <div className="relative">
                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-3 pl-12 pr-4 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 dark:focus:ring-brand-accent/50 dark:focus:border-brand-accent outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-600 dark:text-slate-400 ml-1">Description (Optional)</label>
                        <div className="relative">
                            <FileText className="absolute left-4 top-4 w-5 h-5 text-slate-500" />
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-3 pl-12 pr-4 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 dark:focus:ring-brand-accent/50 dark:focus:border-brand-accent outline-none transition-all min-h-[100px]"
                                placeholder="What was this for?"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-4 rounded-xl font-bold text-lg shadow-xl transition-all active:scale-95 ${type === 'expense'
                            ? 'bg-red-600 hover:bg-red-500 shadow-red-600/20'
                            : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/20'
                            } text-white`}
                    >
                        {loading ? 'Processing...' : isUpdateMode ? `Update ${type === 'expense' ? 'Expense' : 'Income'}` : `Add ${type === 'expense' ? 'Expense' : 'Income'}`}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default TransactionForm;
