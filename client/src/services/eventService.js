import api from './api';

export const getAllEvents = (params) => api.get('/events', { params });
export const getEventById = (id) => api.get(`/events/${id}`);
export const createEvent = (data) => api.post('/events', data);
export const updateEvent = (id, data) => api.put(`/events/${id}`, data);
export const deleteEvent = (id) => api.delete(`/events/${id}`);
export const approveEvent = (id, data) => api.patch(`/events/${id}/approve`, data);
export const getMyEvents = () => api.get('/events/my-events');