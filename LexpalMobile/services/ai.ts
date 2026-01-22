import api from './api';

export const AIService = {
    getRecentConversations: () => api.get('/api/AI/recent-conversation'),
    getConversationHistory: (convoId: string) => api.get(`/api/AI/convo-history/${convoId}`),
    // Assuming creating a new message might be via socket or a POST endpoint not listed in routes (often handled via socket.io in this stack)
    // Checking routes again: there is no POST /api/AI/message. It is likely WebSocket based.

    deleteConversation: (convoId: string) => api.delete(`/api/AI/conversation/${convoId}`),
    renameConversation: (convoId: string, title: string) => api.put(`/api/AI/conversation/${convoId}`, { title }),
};
