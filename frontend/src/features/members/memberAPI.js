import axiosInstance from '../../services/axiosInstance';

export const memberAPI = {
  getAll: (params) => axiosInstance.get('/members', { params }),
  getById: (id) => axiosInstance.get(`/members/${id}`),
  create: (data) => axiosInstance.post('/members', data),
  update: (id, data) => axiosInstance.put(`/members/${id}`, data),
  delete: (id) => axiosInstance.delete(`/members/${id}`),
  uploadPhoto: (id, formData) => axiosInstance.post(`/members/${id}/photo`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
};
