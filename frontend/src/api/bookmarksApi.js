import apiClient from './apiClient';

const bookmarksApi = {
  getAll: async () => {
    const response = await apiClient.get('/bookmarks');
    return response.data;
  },
  create: async (data) => {
    const response = await apiClient.post('/bookmarks', data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await apiClient.put(`/bookmarks/${id}`, data);
    return response.data;
  },
  delete: async (id) => {
    const response = await apiClient.delete(`/bookmarks/${id}`);
    return response.data;
  },
};

export default bookmarksApi;
