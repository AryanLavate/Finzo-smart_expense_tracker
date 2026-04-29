import React from 'react';
import { PieChart, Shield, Smartphone, Zap, RefreshCw, Download } from 'lucide-react';

const Features = () => {
    const features = [
        {
            icon: <PieChart className="w-8 h-8 text-blue-500" />,
            title: "Smart Analytics",
            description: "Visualize your spending habits with intuitive charts and graphs."
        },
        {
            icon: <Shield className="w-8 h-8 text-green-500" />,
            title: "Secure Data",
            description: "Your financial data is encrypted and stored securely."
        },
        {
            icon: <Smartphone className="w-8 h-8 text-purple-500" />,
            title: "Mobile Friendly",
            description: "Access your dashboard from any device, anywhere."
        },
        {
            icon: <Zap className="w-8 h-8 text-yellow-500" />,
            title: "Instant Updates",
            description: "Real-time balance updates as you add transactions."
        },
        {
            icon: <RefreshCw className="w-8 h-8 text-red-500" />,
            title: "Recurring Bills",
            description: "Set up recurring transactions for bills and subscriptions."
        },
        {
            icon: <Download className="w-8 h-8 text-indigo-500" />,
            title: "Export Reports",
            description: "Download your financial reports in CSV or PDF formats."
        }
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
            <div className="text-center mb-16 transition-transform duration-300 hover:-translate-y-1">
                <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                    Powerful Features for Your Money
                </h1>
                <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                    Everything you need to take control of your financial life.
                </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {features.map((feature, index) => (
                    <div
                        key={index}
                        className="bg-white/90 dark:bg-slate-900/90 p-8 rounded-2xl border border-slate-200/70 dark:border-slate-800/70 hover:shadow-2xl hover:-translate-y-2 hover:border-blue-500/60 dark:hover:border-brand-accent/60 transition-all duration-300 backdrop-blur cursor-default group"
                    >
                        <div className="bg-slate-50 dark:bg-slate-800 w-16 h-16 rounded-xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110">
                            {feature.icon}
                        </div>
                        <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                            {feature.title}
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                            {feature.description}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Features;
