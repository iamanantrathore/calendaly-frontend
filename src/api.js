import axios from 'axios';

// Set a global base URL for all axios requests, including direct axios imports.
axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3002';

// Export the preconfigured instance for explicit use if needed.
const api = axios.create();
export default api;