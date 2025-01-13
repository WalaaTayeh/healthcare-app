import axios from "axios";

// Set the base URL to your backend's URL
const api = axios.create({
  baseURL: "http://localhost:5000", // Replace with your backend URL in production
});

export default api;
