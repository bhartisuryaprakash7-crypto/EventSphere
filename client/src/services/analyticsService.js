import api from './api';

export const getDashboardStats = () => api.get('/analytics/dashboard');
export const getEventAnalytics = (eventId) => api.get(`/analytics/event/${eventId}`);