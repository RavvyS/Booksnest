import apiClient from './apiClient';

const booksApi = {
  getAll: async () => {
    const response = await apiClient.get('/books');
    return response.data;
  },
  getById: async (id) => {
    const response = await apiClient.get(`/books/${id}`);
    return response.data;
  },
  read: async (id) => {
    const response = await apiClient.get(`/books/${id}/read`, {
      responseType: 'blob'
    });
    return response.data;
  },
  create: async (formData) => {
    const response = await apiClient.post('/books', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
  update: async (id, data) => {
    const response = await apiClient.put(`/books/${id}`, data);
    return response.data;
  },
  delete: async (id) => {
    const response = await apiClient.delete(`/books/${id}`);
    return response.data;
  },
  searchExternal: async (query) => {
    const response = await apiClient.get(`/books/search-external?q=${query}`);
    return response.data;
  },
  getFreeExternalBooks: async (subject = 'fiction') => {
    const response = await apiClient.get(`/books/external/free?subject=${subject}`);
    return response.data;
  },
};

export default booksApi;
