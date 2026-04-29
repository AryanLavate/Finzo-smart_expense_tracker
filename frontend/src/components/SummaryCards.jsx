import React, { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Wallet, PieChart } from 'lucide-react';

// Simple animated number for a smoother "premium" feel
const AnimatedNumber = ({ value }) => {
    const [display, setDisplay] = useState(0);

    useEffect(() => {
        const target = Number(value) || 0;
        const duration = 600;
        const frames = 30;
        const increment = (target - display) / frames;
        let frame = 0;
        const id = setInterval(() => {
            frame += 1;
            const next = display + increment * frame;
            if (frame >= frames) {
                setDisplay(target);
                clearInterval(id);
            } else {
                setDisplay(next);
            }
        }, duration / frames);
        return () => clearInterval(id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    return (
        <span>
            {value.toLocaleString
                ? Number(display).toLocaleString(undefined, { maximumFractionDigits: 1 })
                : display}
        </span>
    );
};

const SummaryCards = ({ transactions }) => {
    const totalIncome = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

    const balance = totalIncome - totalExpense;
    const savingsRatio = totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome * 100).toFixed(1) : 0;

    const cards = [
        {
            title: 'Total Income',
            amount: totalIncome,
            icon: TrendingUp,
            color: 'text-emerald-500',
            bg: 'bg-emerald-500/10',
            border: 'border-emerald-500/20'
        },
        {
            title: 'Total Expenses',
            amount: totalExpense,
            icon: TrendingDown,
            color: 'text-red-500',
            bg: 'bg-red-500/10',
            border: 'border-red-500/20'
        },
        {
            title: 'Net Balance',
            amount: balance,
            icon: Wallet,
            color: 'text-blue-500 dark:text-brand-accent',
            bg: 'bg-blue-500/10 dark:bg-brand-accent/10',
            border: 'border-blue-500/20 dark:border-brand-accent/20'
        },
        {
            title: 'Savings Ratio',
            amount: Number(savingsRatio),
            icon: PieChart,
            color: 'text-amber-500',
            bg: 'bg-amber-500/10',
            border: 'border-amber-500/20'
        }
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {cards.map((card, index) => (
                <div
                    key={index}
                    className="bg-white/90 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm dark:shadow-none hover:shadow-xl hover:-translate-y-1 hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300 group backdrop-blur"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className={`p-3 ${card.bg} ${card.border} border rounded-2xl group-hover:scale-110 transition-transform`}>
                            <card.icon className={`w-6 h-6 ${card.color}`} />
                        </div>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">{card.title}</p>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                        {card.title === 'Savings Ratio' ? (
                            <AnimatedNumber value={card.amount} />
                        ) : (
                            <>
                                ₹<AnimatedNumber value={card.amount} />
                            </>
                        )}
                        {card.title === 'Savings Ratio' && '%'}
                    </h2>
                </div>
            ))}
        </div>
    );
};

export default SummaryCards;
