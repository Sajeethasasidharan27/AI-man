import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

export const getClaims = (params = {}) => api.get('/claims', { params });
export const getClaimById = (id) => api.get(`/claims/${id}`);
export const createClaim = (formData) =>
  api.post('/claims', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const reviewClaim = (id, data) => api.patch(`/claims/${id}/review`, data);
export const deleteClaim = (id) => api.delete(`/claims/${id}`);
export const getStats = () => api.get('/claims/stats');

export default api;
