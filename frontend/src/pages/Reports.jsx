import React, { useState } from 'react';
import { Download, FileText, BarChart3, Eye, Loader2 } from 'lucide-react';
import { transactionService } from '../services/transactionService';

const Reports = () => {
    const reports = [
        {
            title: "Monthly Expense Report",
            description: "Detailed breakdown of your expenses for the current month.",
            type: "PDF"
        },
        {
            title: "Annual Financial Summary",
            description: "Yearly overview of income, expenses, and savings.",
            type: "PDF"
        },
        {
            title: "Transaction History",
            description: "Complete list of all transactions in CSV format.",
            type: "CSV"
        },
        {
            title: "Category Analysis",
            description: "Spending analysis by category.",
            type: "PDF"
        }
    ];

    const [previewReport, setPreviewReport] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchReportData = async (reportTitle) => {
        try {
            switch (reportTitle) {
                case "Monthly Expense Report":
                case "Annual Financial Summary":
                    // For now, using health score as a summary. 
                    // ideally backend should support date filtering for specific months/years
                    const health = await transactionService.getHealthScore();
                    const classification = await transactionService.getClassification();
                    return { health, classification };

                case "Category Analysis":
                    const cats = await transactionService.getClassification();
                    return { classification: cats };

                case "Transaction History":
                    const transactions = await transactionService.getTransactions();
                    return transactions;

                default:
                    return null;
            }
        } catch (error) {
            console.error("Failed to fetch report data:", error);
            return null;
        }
    };

    const generateReportContent = (report, data) => {
        const header = `Report: ${report.title}\nDescription: ${report.description}\nGenerated At: ${new Date().toLocaleString()}\n\n`;
        let content = "";

        if (!data) return "Error: Could not retrieve data for this report.";

        if (report.title === "Transaction History" && Array.isArray(data)) {
            // CSV Format
            content = "Date,Description,Category,Amount,Type\n";
            data.forEach(t => {
                content += `${new Date(t.date).toLocaleDateString()},${t.description},${t.category},${t.amount},${t.type}\n`;
            });
        } else if (report.title === "Category Analysis") {
            const cats = data.classification?.categories || {};
            content = "Spending by Category:\n\n";
            if (Object.keys(cats).length === 0) {
                content += "No expense data available for categorization.\n";
            } else {
                Object.entries(cats).forEach(([cat, amount]) => {
                    content += `- ${cat}: ₹${amount}\n`;
                });
            }
        } else {
            // Monthly/Annual Summary
            const h = data.health || {};
            const cats = data.classification?.categories || {};

            content = "Financial Summary:\n\n" +
                `Total Income: ₹${h.total_income || 0}\n` +
                `Total Expenses: ₹${h.total_expenses || 0}\n` +
                `Savings Ratio: ${h.savings_ratio ? (h.savings_ratio * 100).toFixed(1) : 0}%\n` +
                `Financial Health Score: ${h.score || 0}/100\n\n` +
                "Breakdown by Category:\n";

            if (Object.keys(cats).length === 0) {
                content += "(No expenses recorded)\n";
            } else {
                Object.entries(cats).forEach(([cat, amount]) => {
                    content += `- ${cat}: ₹${amount}\n`;
                });
            }
        }

        return report.type === 'CSV' ? content : header + content;
    };

    const handleDownload = async (report) => {
        setLoading(true);
        try {
            const data = await fetchReportData(report.title);
            const fullContent = generateReportContent(report, data);

            const mimeType = report.type === 'CSV' ? 'text/csv' : 'text/plain';
            const extension = report.type === 'CSV' ? 'csv' : 'txt';

            const blob = new Blob([fullContent], { type: mimeType });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${report.title.toLowerCase().replace(/\s+/g, '-')}.${extension}`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } finally {
            setLoading(false);
        }
    };

    const handlePreview = async (report) => {
        setLoading(true);
        try {
            const data = await fetchReportData(report.title);
            // Store raw data for custom rendering in modal, or pre-generated text
            setPreviewReport({ ...report, data });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8 relative">
            <div className="text-center mb-16">
                <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-6">
                    Reports & Analytics
                </h1>
                <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                    Download detailed reports to analyze your financial health.
                </p>
            </div>

            {loading && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/20 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-2xl flex items-center gap-3">
                        <Loader2 className="w-6 h-6 animate-spin text-blue-600 dark:text-brand-primary" />
                        <span className="font-medium text-slate-700 dark:text-slate-200">Generating Report...</span>
                    </div>
                </div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
                {reports.map((report, index) => (
                    <div key={index} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between hover:shadow-md transition-shadow">
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <div className="bg-blue-100 dark:bg-brand-primary/20 p-3 rounded-xl">
                                    {report.type === 'CSV' ? (
                                        <FileText className="w-6 h-6 text-blue-600 dark:text-brand-secondary" />
                                    ) : (
                                        <BarChart3 className="w-6 h-6 text-blue-600 dark:text-brand-secondary" />
                                    )}
                                </div>
                                <span className="text-xs font-semibold px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-full">
                                    {report.type}
                                </span>
                            </div>
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                                {report.title}
                            </h3>
                            <p className="text-slate-600 dark:text-slate-400 text-sm mb-6">
                                {report.description}
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-3 mt-4">
                            <button
                                onClick={() => handlePreview(report)}
                                className="w-full py-2 px-4 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                            >
                                <Eye className="w-4 h-4" />
                                Preview
                            </button>
                            <button
                                onClick={() => handleDownload(report)}
                                className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-500 dark:bg-brand-primary dark:hover:bg-brand-accent text-white rounded-lg transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                            >
                                <Download className="w-4 h-4" />
                                Download
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Preview Modal */}
            {previewReport && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
                        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">{previewReport.title}</h3>
                            <button
                                onClick={() => setPreviewReport(null)}
                                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                            >
                                <span className="sr-only">Close</span>
                                <svg className="w-6 h-6 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="p-6 overflow-y-auto">
                            <div className="space-y-4">
                                <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800">
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">Report Description</p>
                                    <p className="text-slate-900 dark:text-white">{previewReport.description}</p>
                                </div>
                                <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800 font-mono text-sm">
                                    <p className="text-xs text-slate-400 mb-2 uppercase tracking-wider">Preview Content</p>
                                    <div className="whitespace-pre-wrap text-slate-700 dark:text-slate-300 font-mono text-xs sm:text-sm">
                                        {generateReportContent(previewReport, previewReport.data)}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex justify-end gap-3">
                            <button
                                onClick={() => setPreviewReport(null)}
                                className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors font-medium"
                            >
                                Close
                            </button>
                            <button
                                onClick={() => {
                                    handleDownload(previewReport);
                                    setPreviewReport(null);
                                }}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 dark:bg-brand-primary dark:hover:bg-brand-accent text-white rounded-lg transition-colors font-medium flex items-center gap-2"
                            >
                                <Download className="w-4 h-4" />
                                Download Full Report
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div >
    );
};

export default Reports;
