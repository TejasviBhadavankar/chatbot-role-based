import api from "./axios.js";

export const getBotData = () => api.get("/admin");

export const createBotData = (data) => api.post("/admin", data);

export const updateBotData = (id, data) =>
  api.put(`/admin/${id}`, data);

export const deleteBotData = (id) =>
  api.delete(`/admin/${id}`);
