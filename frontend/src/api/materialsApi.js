import apiClient from './apiClient';

const materialsApi = {
  getAll: async (params = {}) => {
    const response = await apiClient.get('/materials', { params });
    return response.data;
  },
  getPending: async () => {
    const response = await apiClient.get('/materials/pending');
    return response.data;
  },
  getMine: async () => {
    const response = await apiClient.get('/materials/my');
    return response.data;
  },
  getById: async (id) => {
    const response = await apiClient.get(`/materials/${id}`);
    return response.data;
  },
  create: async (data) => {
    const response = await apiClient.post('/materials', data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await apiClient.put(`/materials/${id}`, data);
    return response.data;
  },
  delete: async (id) => {
    const response = await apiClient.delete(`/materials/${id}`);
    return response.data;
  },
  approve: async (id, status) => {
    const response = await apiClient.patch(`/materials/${id}/approve`, { status });
    return response.data;
  },
};

export default materialsApi;
