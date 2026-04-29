import React, { useEffect, useState } from 'react';
import { Shield, PlusCircle, FileText, HeartPulse, Car, Home, Pencil, Trash2, X } from 'lucide-react';
import { insuranceService } from '../services/insuranceService';

const FD = () => {
    const [policies, setPolicies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [form, setForm] = useState({
        provider: '',
        type: 'health',
        policyNumber: '',
        premium: '',
        coverage: '',
        expiryDate: ''
    });
    const [editingId, setEditingId] = useState(null);

    const loadPolicies = async () => {
        setError('');
        setLoading(true);
        try {
            const data = await insuranceService.listPolicies();
            setPolicies(Array.isArray(data) ? data : []);
        } catch (e) {
            console.error('Failed to load policies', e);
            setError('Failed to load policies. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPolicies();
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSaving(true);

        const payload = {
            provider: form.provider.trim(),
            type: form.type,
            policy_number: form.policyNumber.trim(),
            premium: Number(form.premium),
            coverage: Number(form.coverage),
            expiry_date: form.expiryDate
        };

        try {
            if (editingId) {
                const updated = await insuranceService.updatePolicy(editingId, payload);
                setPolicies(policies.map(p => (p.id === editingId ? updated : p)));
                setEditingId(null);
            } else {
                const created = await insuranceService.createPolicy(payload);
                setPolicies([created, ...policies]);
            }

            setForm({
                provider: '',
                type: 'health',
                policyNumber: '',
                premium: '',
                coverage: '',
                expiryDate: ''
            });
        } catch (e) {
            console.error('Failed to save policy', e);
            setError(e?.response?.data?.detail || 'Failed to save policy. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (policy) => {
        setForm({
            provider: policy.provider || '',
            type: policy.type || 'health',
            policyNumber: policy.policy_number || '',
            premium: policy.premium ?? '',
            coverage: policy.coverage ?? '',
            expiryDate: policy.expiry_date || ''
        });
        setEditingId(policy.id);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this policy?')) {
            setError('');
            try {
                await insuranceService.deletePolicy(id);
                setPolicies(policies.filter(p => p.id !== id));
                if (editingId === id) {
                    handleCancelEdit();
                }
            } catch (e) {
                console.error('Failed to delete policy', e);
                setError(e?.response?.data?.detail || 'Failed to delete policy. Please try again.');
            }
        }
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setForm({
            provider: '',
            type: 'health',
            policyNumber: '',
            premium: '',
            coverage: '',
            expiryDate: ''
        });
    };

    const typeIcon = (type) => {
        if (type === 'health') return <HeartPulse className="w-5 h-5 text-emerald-400" />;
        if (type === 'vehicle') return <Car className="w-5 h-5 text-blue-400" />;
        if (type === 'home') return <Home className="w-5 h-5 text-indigo-400" />;
        return <Shield className="w-5 h-5 text-slate-300" />;
    };

    return (
        <div className="max-w-5xl mx-auto px-4 py-12">
            <div className="text-center mb-12 transition-transform duration-300 hover:-translate-y-1">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">Insurance Overview</h1>
                <p className="text-slate-600 dark:text-slate-400">
                    Track your health, vehicle and other insurance policies in one place.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-start">
                {/* Form */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-xl bg-blue-600/10 dark:bg-brand-primary/15 flex items-center justify-center">
                                <PlusCircle className="w-5 h-5 text-blue-500 dark:text-brand-secondary" />
                            </div>
                            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                                {editingId ? 'Update Policy' : 'Add Insurance Policy'}
                            </h2>
                        </div>
                        {editingId && (
                            <button
                                onClick={handleCancelEdit}
                                className="text-xs text-red-500 hover:text-red-600 flex items-center gap-1"
                            >
                                <X className="w-4 h-4" /> Cancel
                            </button>
                        )}
                    </div>
                    {error && (
                        <div className="mb-4 p-3 rounded-xl border border-red-500/20 bg-red-500/10 text-red-500 dark:text-red-400 text-sm">
                            {error}
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                Provider / Company
                            </label>
                            <input
                                type="text"
                                name="provider"
                                value={form.provider}
                                onChange={handleChange}
                                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-brand-accent"
                                placeholder="e.g. LIC, HDFC Ergo"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                    Insurance Type
                                </label>
                                <select
                                    name="type"
                                    value={form.type}
                                    onChange={handleChange}
                                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-brand-accent"
                                >
                                    <option value="health">Health</option>
                                    <option value="vehicle">Bike / Car</option>
                                    <option value="home">Home</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                    Policy Number
                                </label>
                                <input
                                    type="text"
                                    name="policyNumber"
                                    value={form.policyNumber}
                                    onChange={handleChange}
                                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-brand-accent"
                                    placeholder="e.g. POL12345678"
                                    required
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                    Annual Premium (₹)
                                </label>
                                <input
                                    type="number"
                                    name="premium"
                                    value={form.premium}
                                    onChange={handleChange}
                                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-brand-accent"
                                    placeholder="e.g. 12000"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                    Coverage Amount (₹)
                                </label>
                                <input
                                    type="number"
                                    name="coverage"
                                    value={form.coverage}
                                    onChange={handleChange}
                                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-brand-accent"
                                    placeholder="e.g. 500000"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                Expiry / Renewal Date
                            </label>
                            <input
                                type="date"
                                name="expiryDate"
                                value={form.expiryDate}
                                onChange={handleChange}
                                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-brand-accent"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={saving}
                            className="w-full bg-blue-600 hover:bg-blue-500 dark:bg-brand-primary dark:hover:bg-brand-accent text-white font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2 hover:shadow-xl hover:shadow-blue-500/40 dark:hover:shadow-brand-accent/40 active:scale-[0.98]"
                        >
                            <Shield className="w-5 h-5" />
                            {saving ? 'Saving...' : (editingId ? 'Update Policy' : 'Save Policy')}
                        </button>
                    </form>
                </div>

                {/* List */}
                <div className="bg-white dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 rounded-2xl p-6 text-slate-900 dark:text-white shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 min-h-[260px] border border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-2 mb-4">
                        <FileText className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
                        <h2 className="text-lg font-semibold">Your Policies</h2>
                    </div>
                    {loading ? (
                        <div className="min-h-[180px] flex items-center justify-center">
                            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 dark:border-brand-accent"></div>
                        </div>
                    ) : policies.length === 0 ? (
                        <p className="text-slate-400 text-sm">
                            No insurance policies added yet. Add your health, bike/car, or other insurance details to see them
                            here.
                        </p>
                    ) : (
                        <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
                            {policies.map((p) => (
                                <div
                                    key={p.id}
                                    className={`border rounded-xl p-4 bg-slate-50 dark:bg-slate-900/60 transition-all ${editingId === p.id
                                            ? 'border-blue-500 ring-1 ring-blue-500 dark:border-brand-accent dark:ring-brand-accent'
                                            : 'border-slate-200 dark:border-slate-700'
                                        }`}
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex items-start gap-3">
                                            <div className="mt-1">{typeIcon(p.type)}</div>
                                            <div>
                                                <h3 className="font-semibold text-sm">
                                                    {p.provider} <span className="text-slate-500 dark:text-slate-400">• {p.policy_number}</span>
                                                </h3>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 capitalize mt-1">{p.type} insurance</p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                                    Coverage: <span className="text-slate-900 dark:text-slate-100">₹{Number(p.coverage).toLocaleString()}</span>
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right text-xs text-slate-500 dark:text-slate-400">
                                            <p>Premium</p>
                                            <p className="text-sm text-emerald-500 dark:text-emerald-400 font-semibold">
                                                ₹{Number(p.premium).toLocaleString()}/yr
                                            </p>
                                            <p className="mt-1">Renewal</p>
                                            <p className="text-slate-700 dark:text-slate-200 font-medium">{p.expiry_date}</p>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex justify-end gap-2 mt-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                                        <button
                                            onClick={() => handleEdit(p)}
                                            className="px-3 py-1.5 text-sm text-slate-600 dark:text-slate-300 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-brand-primary/20 rounded-lg transition-colors flex items-center gap-2"
                                            title="Edit Policy"
                                        >
                                            <Pencil className="w-4 h-4" />
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(p.id)}
                                            className="px-3 py-1.5 text-sm text-slate-600 dark:text-slate-300 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors flex items-center gap-2"
                                            title="Delete Policy"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FD;
