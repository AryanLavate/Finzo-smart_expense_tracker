import React from 'react';

const About = () => {
    return (
        <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
            <div className="text-center mb-16 transition-transform duration-300 hover:-translate-y-1">
                <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-6">
                    About Smart Expense Tracker
                </h1>
                <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl mx-auto">
                    We believe that financial freedom starts with awareness. Our mission is to provide simple, powerful tools that help everyone manage their money better.
                </p>
            </div>

            <div className="prose prose-slate dark:prose-invert max-w-none">
                <div className="bg-white/90 dark:bg-slate-900/90 p-8 rounded-2xl border border-slate-200/70 dark:border-slate-800/70 mb-8 hover:shadow-2xl hover:-translate-y-2 hover:border-blue-500/60 dark:hover:border-brand-accent/60 transition-all duration-300 backdrop-blur">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Our Story</h2>
                    <p className="text-slate-600 dark:text-slate-400 mb-4">
                        Started as a simple project to track daily expenses, Smart Expense Tracker has evolved into a comprehensive personal finance management tool. We realized that existing solutions were either too complex or too simple. We wanted to build something that strikes the perfect balance.
                    </p>
                    <p className="text-slate-600 dark:text-slate-400">
                        Today, we help thousands of users track their income, manage budgets, and plan for their future with our easy-to-use interface and powerful analytics.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-white/90 dark:bg-slate-900/90 p-8 rounded-2xl border border-slate-200/70 dark:border-slate-800/70 hover:shadow-2xl hover:-translate-y-2 hover:border-emerald-500/60 transition-all duration-300 backdrop-blur cursor-default">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Our Mission</h2>
                        <p className="text-slate-600 dark:text-slate-400">
                            To empower individuals to take control of their financial future through intuitive technology and actionable insights.
                        </p>
                    </div>
                    <div className="bg-white/90 dark:bg-slate-900/90 p-8 rounded-2xl border border-slate-200/70 dark:border-slate-800/70 hover:shadow-2xl hover:-translate-y-2 hover:border-purple-500/60 transition-all duration-300 backdrop-blur cursor-default">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Our Vision</h2>
                        <p className="text-slate-600 dark:text-slate-400">
                            A world where everyone has the tools and knowledge to make smart financial decisions and achieve their goals.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
