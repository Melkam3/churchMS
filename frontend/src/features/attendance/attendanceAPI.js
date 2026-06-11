import axiosInstance from '../../services/axiosInstance';

export const attendanceAPI = {
  getAll: (params) => axiosInstance.get('/attendance', { params }),
  getById: (id) => axiosInstance.get(`/attendance/${id}`),
  record: (data) => axiosInstance.post('/attendance', data),
  update: (id, data) => axiosInstance.put(`/attendance/${id}`, data),
  delete: (id) => axiosInstance.delete(`/attendance/${id}`),
};
