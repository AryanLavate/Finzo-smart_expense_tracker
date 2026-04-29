import api from './api';

export const insuranceService = {
  listPolicies: async () => {
    const res = await api.get('/insurance/');
    return res.data;
  },
  createPolicy: async (data) => {
    const res = await api.post('/insurance/', data);
    return res.data;
  },
  updatePolicy: async (id, data) => {
    const res = await api.put(`/insurance/${id}`, data);
    return res.data;
  },
  deletePolicy: async (id) => {
    const res = await api.delete(`/insurance/${id}`);
    return res.data;
  },
};

