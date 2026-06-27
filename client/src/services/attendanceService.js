import api from './api';

export const getQRCode = async (eventId) => {
  const res = await api.get(`/attendance/qrcode/${eventId}`);
  return res.data;
};

export const saveAttendance = async (data) => {
  const res = await api.post("/attendance/mark", data);
  return res.data;
};

export const fetchAttendanceByEvent = async (eventId) => {
  const res = await api.get(`/attendance/event/${eventId}`);
  return res.data;
};

const attendanceService = {
  getQRCode,
  saveAttendance,
  fetchAttendanceByEvent,
};

export default attendanceService;