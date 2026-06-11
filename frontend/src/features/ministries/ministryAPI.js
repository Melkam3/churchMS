import axiosInstance from '../../services/axiosInstance';

export const ministryAPI = {
  getAll: (params) => axiosInstance.get('/ministries', { params }),
  getById: (id) => axiosInstance.get(`/ministries/${id}`),
  create: (data) => axiosInstance.post('/ministries', data),
  update: (id, data) => axiosInstance.put(`/ministries/${id}`, data),
  delete: (id) => axiosInstance.delete(`/ministries/${id}`),
  assignMember: (id, memberId) => axiosInstance.post(`/ministries/${id}/members`, { memberId }),
  removeMember: (id, memberId) => axiosInstance.delete(`/ministries/${id}/members/${memberId}`),
};
