import api from './api';

export const sendChatMessage = async (message, sessionId = "default") => {
  const response = await api.post('/ai/chat', { message, sessionId });
  return response.data;
};

export const clearChatSession = async (sessionId = "default") => {
  const response = await api.delete(`/ai/session/${sessionId}`);
  return response.data;
};