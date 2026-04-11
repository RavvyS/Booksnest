import apiClient from './apiClient';

const borrowsApi = {
  borrowBook: async (bookId) => {
    const response = await apiClient.post(`/borrows/borrow/${bookId}`);
    return response.data;
  },
  returnBook: async (bookId) => {
    const response = await apiClient.post(`/borrows/return/${bookId}`);
    return response.data;
  },
  getMyBorrows: async () => {
    const response = await apiClient.get('/borrows/my-borrows');
    return response.data;
  },
  joinQueue: async (bookId) => {
    const response = await apiClient.post(`/borrows/queue/${bookId}`);
    return response.data;
  },
  getMyQueue: async () => {
    const response = await apiClient.get('/borrows/queue/my');
    return response.data;
  },
  updateQueue: async (requestId, note) => {
    const response = await apiClient.put(`/borrows/queue/${requestId}`, { note });
    return response.data;
  },
  cancelQueue: async (requestId) => {
    const response = await apiClient.delete(`/borrows/queue/${requestId}`);
    return response.data;
  },
};

export default borrowsApi;
