import api from "./axios.js";

export const sendMessage = (data) => api.post("/chat", data);
export const getHistory = () => api.get("/chat/history");
export const deleteHistory = () => api.delete("/chat/history");
