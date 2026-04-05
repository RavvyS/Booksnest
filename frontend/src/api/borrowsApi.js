import apiClient from './apiClient';

const borrowsApi = {
  borrowBook: async (bookId) => {
    const response = await apiClient.post(`/borrow/borrow/${bookId}`);
    return response.data;
  },
  returnBook: async (bookId) => {
    const response = await apiClient.post(`/borrow/return/${bookId}`);
    return response.data;
  },
  getMyBorrows: async () => {
    const response = await apiClient.get('/borrow/my-borrows');
    return response.data;
  },
  joinQueue: async (bookId) => {
    const response = await apiClient.post(`/borrow/queue/${bookId}`);
    return response.data;
  },
  getMyQueue: async () => {
    const response = await apiClient.get('/borrow/queue/my');
    return response.data;
  },
  updateQueue: async (requestId, note) => {
    const response = await apiClient.put(`/borrow/queue/${requestId}`, { note });
    return response.data;
  },
  cancelQueue: async (requestId) => {
    const response = await apiClient.delete(`/borrow/queue/${requestId}`);
    return response.data;
  },
};

export default borrowsApi;
