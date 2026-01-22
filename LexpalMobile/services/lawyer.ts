import api from './api';

export const LawyerService = {
    getAllLawyers: (params?: { limit?: number, cursor?: string }) => api.get('/api/explore/fetch/all-lawyers', { params }),
    getLawyerById: (lawyerId: string) => api.get(`/api/explore/fetch/lawyer/${lawyerId}`),
};
