import apiClient from './apiClient';

const categoriesApi = {
  getAll: async () => {
    const response = await apiClient.get('/categories');
    return response.data;
  },
  getById: async (id) => {
    const response = await apiClient.get(`/categories/${id}`);
    return response.data;
  },
  create: async (data) => {
    const response = await apiClient.post('/categories', data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await apiClient.put(`/categories/${id}`, data);
    return response.data;
  },
  delete: async (id) => {
    const response = await apiClient.delete(`/categories/${id}`);
    return response.data;
  },
};

export default categoriesApi;
