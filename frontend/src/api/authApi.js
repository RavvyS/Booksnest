import apiClient from './apiClient';

const authApi = {
  login: async (email, password) => {
    const response = await apiClient.post('/auth/login', { email, password });
    return response.data; // Should return { token, user }
  },
  register: async (userData) => {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  },
  getProfile: async () => {
    const response = await apiClient.get('/auth/profile');
    return response.data;
  },
};

export default authApi;
