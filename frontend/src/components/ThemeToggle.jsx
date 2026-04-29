import React, { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

const ThemeToggle = () => {
    // Read from localStorage on mount, default to dark mode (false = light, true = dark)
    const [isDark, setIsDark] = useState(() => {
        const saved = localStorage.getItem('theme');
        if (saved === 'dark') return true;
        if (saved === 'light') return false;
        // Default to dark mode if no preference saved (matches original behavior)
        return true;
    });

    useEffect(() => {
        // Apply theme to document
        if (isDark) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDark]);

    // Check localStorage on mount to sync with any external changes
    useEffect(() => {
        const handleStorageChange = () => {
            const saved = localStorage.getItem('theme');
            if (saved === 'dark' && !isDark) {
                setIsDark(true);
            } else if (saved === 'light' && isDark) {
                setIsDark(false);
            }
        };

        // Check on mount
        const saved = localStorage.getItem('theme');
        if (saved === 'dark' && !isDark) {
            setIsDark(true);
        } else if (saved === 'light' && isDark) {
            setIsDark(false);
        }

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [isDark]);

    return (
        <button
            onClick={() => setIsDark(!isDark)}
            className="p-2 rounded-lg bg-slate-200 dark:bg-brand-primary text-slate-800 dark:text-brand-secondary hover:bg-slate-300 dark:hover:bg-brand-accent transition-colors"
            aria-label="Toggle theme"
        >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
    );
};

export default ThemeToggle;
