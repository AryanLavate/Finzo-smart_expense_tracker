import React from 'react';
import { BookOpen, Plus, TrendingUp, Settings } from 'lucide-react';

const UserGuide = () => {
    const guides = [
        {
            icon: <Plus className="w-6 h-6 text-blue-500" />,
            title: "Adding Transactions",
            content: "Navigate to the Dashboard or Transactions page. Click on the 'Add Transaction' button. Select whether it's an Income or Expense, enter the amount, select a category, and add a description. Click Save."
        },
        {
            icon: <TrendingUp className="w-6 h-6 text-green-500" />,
            title: "Viewing Analytics",
            content: "The Dashboard provides a quick overview of your financial health. You can see your total balance, income, and expenses. The charts show your spending trends over time and by category."
        },
        {
            icon: <Settings className="w-6 h-6 text-purple-500" />,
            title: "Managing Settings",
            content: "You can toggle between Dark and Light mode using the theme button in the navigation bar. Profile settings allow you to update your personal information."
        },
        {
            icon: <BookOpen className="w-6 h-6 text-orange-500" />,
            title: "Using Calculators",
            content: "Use the Insurance page to record details of your health, bike/car, home and other insurance policies so you never miss renewals."
        }
    ];

    return (
        <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
            <div className="text-center mb-16 transition-transform duration-300 hover:-translate-y-1">
                <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-6">
                    User Guide
                </h1>
                <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                    Learn how to get the most out of Smart Expense Tracker.
                </p>
            </div>

            <div className="space-y-8">
                {guides.map((guide, index) => (
                    <div
                        key={index}
                        className="bg-white/90 dark:bg-slate-900/90 p-6 rounded-2xl border border-slate-200/70 dark:border-slate-800/70 flex gap-6 hover:shadow-2xl hover:-translate-y-2 hover:border-blue-500/60 dark:hover:border-brand-accent/60 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all duration-300 cursor-default backdrop-blur"
                    >
                        <div className="flex-shrink-0">
                            <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center">
                                {guide.icon}
                            </div>
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                                {guide.title}
                            </h3>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                {guide.content}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UserGuide;
