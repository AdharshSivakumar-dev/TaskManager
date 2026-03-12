import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000',
});

// Request interceptor to add the authorization token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle 401s
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('access_token');
      // Redirect to login using window.location to force a reload
      // This is a simple approach. A React Router redirect inside a component is usually preferred,
      // but doing it here ensures any 401 instantly logs the user out globally.
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
