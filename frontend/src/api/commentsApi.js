import apiClient from './apiClient';

const commentsApi = {
  getByMaterial: async (materialId) => {
    const response = await apiClient.get('/comments', { params: { materialId } });
    return response.data;
  },
  getByBook: async (bookId) => {
    const response = await apiClient.get('/comments', { params: { bookId } });
    return response.data;
  },
  create: async (data) => {
    const response = await apiClient.post('/comments', data);
    return response.data;
  },
  update: async (id, content) => {
    const response = await apiClient.put(`/comments/${id}`, { content });
    return response.data;
  },
  delete: async (id) => {
    const response = await apiClient.delete(`/comments/${id}`);
    return response.data;
  },
};

export default commentsApi;
