import axiosInstance from '../../services/axiosInstance';

export const familyAPI = {
  getAll: (params) => axiosInstance.get('/families', { params }),
  getById: (id) => axiosInstance.get(`/families/${id}`),
  create: (data) => axiosInstance.post('/families', data),
  update: (id, data) => axiosInstance.put(`/families/${id}`, data),
  delete: (id) => axiosInstance.delete(`/families/${id}`),
  addMember: (id, memberId) => axiosInstance.post(`/families/${id}/members`, { memberId }),
};
