import api from './api';

export const getApprovedEvents = ()             => api.get("/events/approved");
export const getEventById      = (id)           => api.get(`/events/${id}`);
export const createEvent       = (data)         => api.post("/events", data);
export const updateEvent       = (id, data)     => api.put(`/events/${id}`, data);
export const deleteEvent       = (id)           => api.delete(`/events/${id}`);
export const getMyEvents       = ()             => api.get("/events/mine");

export const getPendingEvents  = ()             => api.get("/events/pending");
export const approveEvent      = (id)           => api.put(`/events/${id}/approve`);
export const rejectEvent       = (id, reason)   => api.put(`/events/${id}/reject`, { reason });

export const registerForEvent   = (eventId)     => api.post(`/registrations/${eventId}`);
export const getMyRegistrations = ()            => api.get("/registrations/mine");
export const checkRegistration  = (eventId)     => api.get(`/registrations/check/${eventId}`);
export const cancelRegistration = (eventId)     => api.delete(`/registrations/${eventId}`);

export const getMyCertificates   = ()           => api.get("/certificates/mine");
export const downloadCertificate = (certId)     =>
  api.get(`/certificates/${certId}/download`, { responseType: "blob" });

export const submitFeedback      = (data)       => api.post("/feedback", data);
export const checkFeedbackExists = (eventId)    => api.get(`/feedback/check/${eventId}`);

export default api;