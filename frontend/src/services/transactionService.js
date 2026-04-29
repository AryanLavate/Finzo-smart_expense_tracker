import api from './api';

export const transactionService = {
    getTransactions: async () => {
        const response = await api.get('/transactions/');
        return response.data;
    },
    createTransaction: async (data) => {
        const response = await api.post('/transactions/', data);
        return response.data;
    },
    updateTransaction: async (id, data) => {
        const response = await api.put(`/transactions/${id}`, data);
        return response.data;
    },
    getHealthScore: async () => {
        const response = await api.get('/analytics/health-score');
        return response.data;
    },
    getClassification: async () => {
        const response = await api.get('/analytics/classification');
        return response.data;
    },
    deleteTransaction: async (id) => {
        const response = await api.delete(`/transactions/${id}`);
        return response.data;
    }
};
