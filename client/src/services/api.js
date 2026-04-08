import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  timeout: 15000,
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const message = err.response?.data?.error || err.message || 'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

export const destinationsApi = {
  /** GET /destinations?status=X&country=Y */
  getAll: (params = {}) => api.get('/destinations', { params }).then((r) => r.data),

  /** POST /destinations  (FormData for image upload) */
  create: (formData) =>
    api.post('/destinations', formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then((r) => r.data),

  /** PUT /destinations/:id */
  update: (id, formData) =>
    api.put(`/destinations/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then((r) => r.data),

  /** DELETE /destinations/:id */
  remove: (id) => api.delete(`/destinations/${id}`).then((r) => r.data),
};

export default api;
