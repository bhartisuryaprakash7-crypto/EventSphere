import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,
});

// Automatically attach JWT
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ===============================
// Generate Student QR
// ===============================
export const getQRCode = async (eventId) => {
  const res = await API.get(`/attendance/qrcode/${eventId}`);
  return res.data;
};

// ===============================
// Save Attendance
// ===============================
export const saveAttendance = async (data) => {
  const res = await API.post("/attendance/mark", data);
  return res.data;
};

// ===============================
// Organizer Attendance List
// ===============================
export const fetchAttendanceByEvent = async (eventId) => {
  const res = await API.get(`/attendance/event/${eventId}`);
  return res.data;
};

const attendanceService = {
  getQRCode,
  saveAttendance,
  fetchAttendanceByEvent,
};

export default attendanceService;