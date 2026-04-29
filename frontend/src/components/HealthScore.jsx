import React from 'react';
import { Shield, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

const HealthScore = ({ score = 0, rating = 'N/A', factors = [] }) => {
    const getScoreColor = (s) => {
        if (s >= 80) return 'text-emerald-500';
        if (s >= 60) return 'text-blue-500 dark:text-brand-accent';
        if (s >= 40) return 'text-amber-500';
        return 'text-red-500';
    };

    const getScoreBg = (s) => {
        if (s >= 80) return 'bg-emerald-500';
        if (s >= 60) return 'bg-blue-500 dark:bg-brand-accent';
        if (s >= 40) return 'bg-amber-500';
        return 'bg-red-500';
    };

    const isEmpty = score === null || score === undefined;

    return (
        <div className="bg-white/90 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm dark:shadow-none backdrop-blur">
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-500 dark:text-brand-accent" />
                Financial Health
            </h3>

            {isEmpty && (
                <div className="text-center py-8 text-slate-600 dark:text-slate-400 text-sm">
                    Add a few transactions to calculate your financial health score.
                </div>
            )}

            {!isEmpty && (
                <>
                    <div className="flex flex-col items-center mb-8">
                        <div className="relative w-32 h-32 flex items-center justify-center">
                            <svg className="w-full h-full -rotate-90">
                                <circle
                                    cx="64"
                                    cy="64"
                                    r="58"
                                    fill="transparent"
                                    stroke="currentColor"
                                    strokeWidth="8"
                                    className="text-slate-200 dark:text-slate-800"
                                />
                                <circle
                                    cx="64"
                                    cy="64"
                                    r="58"
                                    fill="transparent"
                                    stroke="currentColor"
                                    strokeWidth="8"
                                    strokeDasharray={364.4}
                                    strokeDashoffset={364.4 - (364.4 * score) / 100}
                                    className={`${getScoreColor(score)} transition-all duration-1000 ease-out`}
                                    strokeLinecap="round"
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-3xl font-bold text-slate-900 dark:text-white">{score}</span>
                                <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Score</span>
                            </div>
                        </div>
                        <div className={`mt-4 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getScoreBg(score)} text-white shadow-lg`}>
                            {rating}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Key Factors</p>
                        {factors.map((factor, index) => (
                            <div key={index} className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-950/50 rounded-xl border border-slate-200 dark:border-slate-800/50">
                                {score >= 60 ? (
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                                ) : (
                                    <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                                )}
                                <span className="text-sm text-slate-700 dark:text-slate-300 leading-tight">{factor}</span>
                            </div>
                        ))}
                        {factors.length === 0 && (
                            <p className="text-sm text-slate-500 italic text-center py-4">Add more transactions to see factors</p>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default HealthScore;
