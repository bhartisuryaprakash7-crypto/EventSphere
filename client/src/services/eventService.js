// client/src/services/eventService.js
import axios from "axios";

const API = axios.create({
  baseURL:         import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,
});

// Attach JWT token to every request automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ─── Events ────────────────────────────────────────────────────────────────
export const getApprovedEvents = ()             => API.get("/events/approved");
export const getEventById      = (id)           => API.get(`/events/${id}`);
export const createEvent       = (data)         => API.post("/events", data);
export const updateEvent       = (id, data)     => API.put(`/events/${id}`, data);
export const deleteEvent       = (id)           => API.delete(`/events/${id}`);
export const getMyEvents       = ()             => API.get("/events/mine");

// ─── Faculty / Approval ────────────────────────────────────────────────────
export const getPendingEvents  = ()             => API.get("/events/pending");
export const approveEvent      = (id)           => API.put(`/events/${id}/approve`);
export const rejectEvent       = (id, reason)   => API.put(`/events/${id}/reject`, { reason });

// ─── Registrations ─────────────────────────────────────────────────────────
export const registerForEvent   = (eventId)     => API.post(`/registrations/${eventId}`);
export const getMyRegistrations = ()            => API.get("/registrations/mine");
export const checkRegistration  = (eventId)     => API.get(`/registrations/check/${eventId}`);
export const cancelRegistration = (eventId)     => API.delete(`/registrations/${eventId}`);

// ─── Certificates ──────────────────────────────────────────────────────────
export const getMyCertificates   = ()           => API.get("/certificates/mine");
export const downloadCertificate = (certId)     =>
  API.get(`/certificates/${certId}/download`, { responseType: "blob" });

// ─── Feedback ──────────────────────────────────────────────────────────────
export const submitFeedback      = (data)       => API.post("/feedback", data);
export const checkFeedbackExists = (eventId)    => API.get(`/feedback/check/${eventId}`);

export default API;