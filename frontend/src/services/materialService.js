import api from "./api";

const materialService = {
  getAllApproved: async (categoryId = "") => {
    const url = categoryId ? `/materials?categoryId=${categoryId}` : "/materials";
    const response = await api.get(url);
    return response.data;
  },
  getPending: async () => {
    const response = await api.get("/materials/pending");
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/materials/${id}`);
    return response.data;
  },
  create: async (data) => {
    const response = await api.post("/materials", data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await api.put(`/materials/${id}`, data);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/materials/${id}`);
    return response.data;
  },
  approve: async (id, status = "approved") => {
    const response = await api.patch(`/materials/${id}/approve`, { status });
    return response.data;
  },
};

export default materialService;
