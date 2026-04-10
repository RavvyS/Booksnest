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
  forgotPassword: async (email) => {
    const response = await apiClient.post('/auth/forgot-password', { email });
    return response.data;
  },
  changePassword: async (passwords) => {
    const response = await apiClient.post('/auth/change-password', passwords);
    return response.data;
  },
};

export default authApi;
