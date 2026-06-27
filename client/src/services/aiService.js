import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Get token from localStorage (adjust based on your auth setup)
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return { headers: { Authorization: `Bearer ${token}` } };
};

export const sendChatMessage = async (message, sessionId = "default") => {
  const response = await axios.post(
    `${API_URL}/ai/chat`,
    { message, sessionId },
    getAuthHeaders()
  );
  return response.data;
};

export const clearChatSession = async (sessionId = "default") => {
  const response = await axios.delete(
    `${API_URL}/ai/session/${sessionId}`,
    getAuthHeaders()
  );
  return response.data;
};