import apiClient from './apiClient';

const usersApi = {
  getPending: async () => {
    const response = await apiClient.get('/users/pending');
    return response.data;
  },
  approve: async (id) => {
    const response = await apiClient.post(`/users/approve/${id}`);
    return response.data;
  },
  deleteUser: async (id) => {
    const response = await apiClient.delete(`/users/${id}`);
    return response.data;
  },
};

export default usersApi;
