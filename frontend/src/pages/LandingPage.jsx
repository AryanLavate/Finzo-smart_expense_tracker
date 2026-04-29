import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
// Default hero image (exists in repo). You can replace this file with your Canva image.
import heroImage from '../assets/hero-image.png';

const LandingPage = () => {
    // Prefer the Canva image if present in `frontend/public/` with the exact filename.
    // If it's missing, fall back to the bundled hero image so Vite never crashes.
    const [heroSrc, setHeroSrc] = useState(
        'https://marketplace.canva.com/EAFYsaCVVjE/1/0/800w/canva-white-and-purple-simple-daily-expense-pie-chart-JU_4nqnx7RY.jpg'
    );

    return (
        <div className="flex flex-col">
            {/* Hero Section */}
            <section className="pt-20 pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
                <div className="flex-1 text-center lg:text-left">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 dark:text-white mb-6">
                        One smart app to manage all your <span className="text-blue-600 dark:text-brand-secondary">accounts, budgets, and bills.</span>
                    </h1>
                    <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto lg:mx-0">
                        Your all-in-one expense manager to track income, expenses, and savings with ease.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                        <Link
                            to="/register"
                            className="px-8 py-4 bg-blue-600 hover:bg-blue-500 dark:bg-brand-primary dark:hover:bg-brand-accent text-white text-lg font-semibold rounded-xl shadow-lg shadow-blue-600/20 dark:shadow-brand-primary/20 transition-all hover:scale-105 flex items-center gap-2"
                        >
                            Get Started Free <ArrowRight className="w-5 h-5" />
                        </Link>
                        <Link
                            to="/features"
                            className="px-8 py-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white text-lg font-semibold rounded-xl transition-all"
                        >
                            View Features
                        </Link>
                    </div>
                    <div className="mt-8 flex items-center justify-center lg:justify-start gap-6 text-sm text-slate-500 dark:text-slate-400">
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                            <span>Free Forever</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                            <span>No Credit Card</span>
                        </div>
                    </div>
                </div>
                <div className="flex-1 relative">
                    <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 dark:from-brand-primary dark:via-brand-accent dark:to-brand-secondary rounded-3xl blur-2xl opacity-30 animate-pulse" />
                    <img
                        src={heroSrc}
                        onError={() => setHeroSrc(heroImage)}
                        alt="Daily Expense Overview"
                        className="relative rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 transform hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(59,130,246,0.45)] dark:hover:shadow-[0_20px_60px_rgba(131,140,229,0.45)] transition-all duration-500"
                    />
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
