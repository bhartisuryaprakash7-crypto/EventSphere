import axios from "axios";

const API_URL = "http://localhost:5000/api/attendance";

export const saveAttendance = async (attendanceData) => {
  const response = await axios.post(`${API_URL}/mark`, attendanceData);
  return response.data;
};

export const fetchAttendanceByEvent = async (eventId) => {
  const response = await axios.get(`${API_URL}/event/${eventId}`);
  return response.data;
};

// Yeh line niche add kar dein:
const attendanceService = { saveAttendance, fetchAttendanceByEvent };
export default attendanceService;