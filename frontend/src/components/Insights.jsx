import React from 'react';
import { Lightbulb, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';

const Insights = ({ transactions }) => {
    // Simple rule-based logic for frontend insights
    const generateInsights = () => {
        const insights = [];
        const expenses = transactions.filter(t => t.type === 'expense');
        const income = transactions.filter(t => t.type === 'income');

        const totalExpense = expenses.reduce((sum, t) => sum + t.amount, 0);
        const totalIncome = income.reduce((sum, t) => sum + t.amount, 0);

        if (totalExpense > totalIncome && totalIncome > 0) {
            insights.push({
                title: 'Overspending Alert',
                message: 'Your total expenses have exceeded your income this month. Consider reviewing your non-essential categories.',
                type: 'danger',
                icon: AlertCircle
            });
        }

        const foodExpense = expenses.filter(t => t.category === 'Food').reduce((sum, t) => sum + t.amount, 0);
        if (foodExpense > (totalExpense * 0.3)) {
            insights.push({
                title: 'High Food Spending',
                message: 'Food accounts for over 30% of your total expenses. Meal prepping could help you save significantly.',
                type: 'warning',
                icon: Lightbulb
            });
        }

        if (totalIncome > 0 && (totalIncome - totalExpense) / totalIncome > 0.2) {
            insights.push({
                title: 'Healthy Savings',
                message: 'Great job! You are saving more than 20% of your income. Consider investing the surplus.',
                type: 'success',
                icon: TrendingUp
            });
        }

        return insights;
    };

    const insights = generateInsights();

    if (insights.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Lightbulb className="w-6 h-6 text-slate-500" />
                </div>
                <p className="text-slate-600 dark:text-slate-500">No insights available yet. Keep tracking your expenses!</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {insights.map((insight, index) => (
                <div
                    key={index}
                    className={`p-5 rounded-2xl border flex gap-4 transition-all hover:scale-[1.02] ${insight.type === 'danger' ? 'bg-red-500/10 border-red-500/20' :
                            insight.type === 'warning' ? 'bg-amber-500/10 border-amber-500/20' :
                                'bg-emerald-500/10 border-emerald-500/20'
                        }`}
                >
                    <div className={`p-3 rounded-xl h-fit ${insight.type === 'danger' ? 'bg-red-500/20 text-red-500' :
                            insight.type === 'warning' ? 'bg-amber-500/20 text-amber-500' :
                                'bg-emerald-500/20 text-emerald-500'
                        }`}>
                        <insight.icon className="w-5 h-5" />
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-900 dark:text-white mb-1">{insight.title}</h4>
                        <p className="text-sm text-slate-700 dark:text-slate-400 leading-relaxed">{insight.message}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Insights;
