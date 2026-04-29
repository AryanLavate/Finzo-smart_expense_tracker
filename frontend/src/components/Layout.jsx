import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import { Wallet, Menu, X } from 'lucide-react';
import { useAuth } from '../context/useAuth';

const Layout = ({ children }) => {
    const location = useLocation();
    const isDashboard = location.pathname === '/dashboard' || location.pathname === '/transactions';
    const { user, logout, isAdmin } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300">
            <nav className="border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <Link to="/" className="flex items-center gap-2">
                            <div className="bg-blue-600 dark:bg-brand-primary p-2 rounded-xl">
                                <Wallet className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 dark:from-brand-secondary dark:to-brand-accent bg-clip-text text-transparent">
                                Finzo
                            </span>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center gap-6">
                            {user && (
                                <>
                                    <Link
                                        to="/dashboard"
                                        className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-brand-accent transition-colors"
                                    >
                                        Home
                                    </Link>
                                    <Link to="/fd" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-brand-accent transition-colors">Insurance</Link>
                                    <Link to="/reports" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-brand-accent transition-colors">Reports</Link>
                                    {isAdmin && (
                                        <Link to="/admin" className="text-sm font-bold text-blue-600 dark:text-brand-accent hover:opacity-80 transition-opacity flex items-center gap-1">
                                            Admin
                                        </Link>
                                    )}
                                </>
                            )}
                            <Link to="/features" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-brand-accent transition-colors">Features</Link>
                            <Link to="/about" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-brand-accent transition-colors">About</Link>
                            <Link to="/guide" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-brand-accent transition-colors">User Guide</Link>
                        </div>

                        <div className="flex items-center gap-4">
                            <ThemeToggle />
                            {!user && !isDashboard && (
                                <Link
                                    to="/login"
                                    className="hidden sm:block px-4 py-2 bg-blue-600 hover:bg-blue-500 dark:bg-brand-primary dark:hover:bg-brand-accent text-white text-sm font-semibold rounded-lg transition-all hover:shadow-lg hover:shadow-blue-500/30 dark:hover:shadow-brand-accent/30 active:scale-[0.98]"
                                >
                                    Sign In
                                </Link>
                            )}
                            {user && (
                                <button
                                    onClick={logout}
                                    className="hidden sm:block px-4 py-2 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-sm font-semibold rounded-lg transition-all active:scale-[0.98]"
                                >
                                    Logout
                                </button>
                            )}
                            {/* Mobile Menu Button */}
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                aria-label="Toggle menu"
                            >
                                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </button>
                        </div>
                    </div>

                    {/* Mobile Menu */}
                    {mobileMenuOpen && (
                        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 py-4 animate-in slide-in-from-top duration-200">
                            <div className="flex flex-col space-y-3">
                                {user && (
                                    <>
                                        <Link
                                            to="/dashboard"
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-brand-accent hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                                        >
                                            Home
                                        </Link>
                                        <Link
                                            to="/fd"
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-brand-accent hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                                        >
                                            Insurance
                                        </Link>
                                        <Link
                                            to="/reports"
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-brand-accent hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                                        >
                                            Reports
                                        </Link>
                                        {isAdmin && (
                                            <Link
                                                to="/admin"
                                                onClick={() => setMobileMenuOpen(false)}
                                                className="px-4 py-2 text-sm font-bold text-blue-600 dark:text-brand-accent hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                                            >
                                                Admin Dashboard
                                            </Link>
                                        )}
                                    </>
                                )}
                                <Link
                                    to="/features"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-brand-accent hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                                >
                                    Features
                                </Link>
                                <Link
                                    to="/about"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-brand-accent hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                                >
                                    About
                                </Link>
                                <Link
                                    to="/guide"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-brand-accent hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                                >
                                    User Guide
                                </Link>
                                {!user && !isDashboard && (
                                    <Link
                                        to="/login"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 dark:bg-brand-primary dark:hover:bg-brand-accent text-white text-sm font-semibold rounded-lg transition-all text-center"
                                    >
                                        Sign In
                                    </Link>
                                )}
                                {user && (
                                    <button
                                        onClick={() => {
                                            setMobileMenuOpen(false);
                                            logout();
                                        }}
                                        className="px-4 py-2 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-sm font-semibold rounded-lg transition-all text-left"
                                    >
                                        Logout
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </nav>

            <main>
                {children}
            </main>

            <footer className="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 py-12 mt-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div className="col-span-1 md:col-span-2">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="bg-blue-600 dark:bg-brand-primary p-1.5 rounded-lg">
                                    <Wallet className="w-5 h-5 text-white" />
                                </div>
                                <span className="text-lg font-bold text-slate-900 dark:text-white">Finzo</span>
                            </div>
                            <p className="text-slate-600 dark:text-slate-400 max-w-sm">
                                Your all-in-one expense manager to track income, expenses, and savings with ease.
                            </p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Product</h3>
                            <ul className="space-y-2">
                                <li><Link to="/features" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-brand-accent">Features</Link></li>
                                {user && (
                                    <>
                                        <li><Link to="/dashboard" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-brand-accent">Home</Link></li>
                                        <li><Link to="/fd" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-brand-accent">Insurance</Link></li>
                                        <li><Link to="/reports" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-brand-accent">Reports</Link></li>
                                    </>
                                )}
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Support</h3>
                            <ul className="space-y-2">
                                <li><Link to="/guide" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-brand-accent">User Guide</Link></li>
                                <li><Link to="/about" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-brand-accent">About Us</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-slate-200 dark:border-slate-800 mt-12 pt-8 text-center text-slate-600 dark:text-slate-400 text-sm">
                        © {new Date().getFullYear()} Finzo. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
