import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api/todos";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const todoAPI = {
  // 获取所有待办事项
  getAllTodos: async () => {
    const response = await api.get("/list");
    return response.data;
  },

  // 创建待办事项
  createTodo: async (title, description = "") => {
    const response = await api.post("/create", { title, description });
    return response.data;
  },

  // 更新待办事项（标记完成/未完成）
  updateTodo: async (data) => {
    const response = await api.post(`/updateStatus`, data);
    return response.data;
  },

  // 删除待办事项
  deleteTodo: async (id) => {
    const response = await api.post(`/delete`, { id });
    return response.data;
  },
};

export default api;
