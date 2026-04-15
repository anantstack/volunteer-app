import axios from "axios";

export const API = axios.create({
  baseURL: "https://your-backend-url.onrender.com/api"
});