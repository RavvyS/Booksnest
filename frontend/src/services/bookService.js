import api from "./api";

const bookService = {
  getAllBooks: async (categoryId = "") => {
    const url = categoryId ? `/books?categoryId=${categoryId}` : "/books";
    const response = await api.get(url);
    return response.data;
  },
  getBookById: async (id) => {
    const response = await api.get(`/books/${id}`);
    return response.data;
  },
  createBook: async (formData) => {
    const response = await api.post("/books", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
  updateBook: async (id, bookData) => {
    const response = await api.put(`/books/${id}`, bookData);
    return response.data;
  },
  deleteBook: async (id) => {
    const response = await api.delete(`/books/${id}`);
    return response.data;
  },
  readBook: async (id) => {
    const response = await api.get(`/books/${id}/read`, {
      responseType: "blob",
    });
    return response.data;
  },
  getReadLink: async (id) => {
    const response = await api.post(`/books/${id}/read-link`);
    return response.data;
  },
};

export default bookService;
