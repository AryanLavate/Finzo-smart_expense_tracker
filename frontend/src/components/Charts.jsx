import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
    PieChart,
    Pie
} from 'recharts';

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-xl shadow-xl">
                <p className="text-slate-600 dark:text-slate-400 text-xs font-medium uppercase tracking-wider">{payload[0].name}</p>
                <p className="text-slate-900 dark:text-white font-bold text-lg">₹{payload[0].value.toLocaleString()}</p>
            </div>
        );
    }
    return null;
};

const Charts = ({ transactions }) => {
    // Prepare data for Bar Chart (Income vs Expense)
    const barData = [
        {
            name: 'Income',
            amount: transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0),
            color: '#10b981'
        },
        {
            name: 'Expenses',
            amount: transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0),
            color: '#ef4444'
        }
    ];

    // Prepare data for Pie Chart (Category-wise Expenses)
    const expenseTransactions = transactions.filter(t => t.type === 'expense');
    const categoryMap = {};
    expenseTransactions.forEach(t => {
        categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount;
    });

    const pieData = Object.keys(categoryMap).map(cat => ({
        name: cat,
        value: categoryMap[cat]
    }));

    const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#64748b'];
    const hasBarData = barData.some(item => item.amount > 0);
    const hasPieData = pieData.length > 0;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="h-[300px] w-full">
                <p className="text-sm text-slate-600 dark:text-slate-500 mb-4 text-center">Income vs Expenses</p>
                {hasBarData ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} className="dark:stroke-slate-800" />
                            <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(148,163,184,0.18)', radius: 8 }} />
                            <Bar dataKey="amount" radius={[8, 8, 0, 0]} barSize={60}>
                                {barData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="h-full flex items-center justify-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-sm">
                        Add income and expense entries to see the chart.
                    </div>
                )}
            </div>

            <div className="h-[300px] w-full">
                <p className="text-sm text-slate-600 dark:text-slate-500 mb-4 text-center">Expense by Category</p>
                {hasPieData ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                        </PieChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="h-full flex items-center justify-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-sm">
                        Add expense transactions to see category breakdowns.
                    </div>
                )}
            </div>
        </div>
    );
};

export default Charts;
