import api from './api';

export const UserService = {
    // Saved Lawyers
    getSavedLawyers: () => api.get('/api/user/saved-lawyers/fetch/all-saved'),
    saveLawyer: (lawyerId: string) => api.post(`/api/user/saved-lawyers/update/new-save/${lawyerId}`),
    unsaveLawyer: (lawyerId: string) => api.delete(`/api/user/saved-lawyers/update/delete-saved-lawyer/${lawyerId}`),
    isLawyerSaved: (lawyerId: string) => api.get(`/api/user/saved-lawyers/fetch/isLawyerSaved/${lawyerId}`),

    // Profile & User Data
    getUsername: () => api.get('/api/user/username'),
    markWalkthroughSeen: () => api.post('/api/user/walkthrough-seen'),

    // Chat Related (User Side)
    getChatList: () => api.get('/api/user/chat/list'),
    getChatProfile: (id: string) => api.get(`/api/user/chat/profile/${id}`),
    getChatHistory: (receiverId: string) => api.get(`/api/user/chat/history/${receiverId}`),

    // Media
    uploadProfilePicture: (formData: FormData) => api.post('/api/upload/profile-pic', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    }),
};
