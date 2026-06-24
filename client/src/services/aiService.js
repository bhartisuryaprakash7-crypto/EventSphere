import api from './api';

export const aiChat = (message) => api.post('/ai/chat', { message });
export const getRecommendations = (interests) => api.post('/ai/recommendations', { interests });
export const getFeedbackSummary = (eventId) => api.get(`/ai/feedback-summary/${eventId}`);