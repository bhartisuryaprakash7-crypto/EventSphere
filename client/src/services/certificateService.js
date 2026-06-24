import api from './api';

export const issueCertificate = (data) => api.post('/certificates', data);
export const getMyCertificates = () => api.get('/certificates/my');
export const verifyCertificate = (code) => api.get(`/certificates/verify/${code}`);