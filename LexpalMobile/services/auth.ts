import api from './api';

export const AuthService = {
    userLogin: (data: any) => api.post('/api/auth/user-login', data),
    userSignup: (data: any) => api.post('/api/auth/user-signup', data),
    lawyerLogin: (data: any) => api.post('/api/auth/lawyer-login', data),
    lawyerSignup: (data: any) => api.post('/api/auth/lawyer-signup', data),
};
