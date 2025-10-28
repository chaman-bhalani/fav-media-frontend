import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:4000/api",
  headers: { "Content-Type": "application/json" },
});

export const fetchEntries = (cursor?: number, limit = 20) =>
  api.get("/entries", { params: { cursor, limit } }).then((r) => r.data);

// export const createEntry = (payload: any) => api.post("/entries", payload).then(r => r.data);
export const createEntry = (payload: any) =>
  api
    .post("/entries", payload)
    .then((r) => r.data)
    .catch((err) => {
      console.error("API Error:", err.response?.data);
      throw err;
    });
export const updateEntry = (id: number, payload: any) =>
  api.put(`/entries/${id}`, payload).then((r) => r.data);
export const deleteEntry = (id: number) =>
  api.delete(`/entries/${id}`).then((r) => r.data);
