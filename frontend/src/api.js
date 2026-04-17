import axios from "axios";

export const API = axios.create({
  baseURL: "https://volunteer-backend-yu6v.onrender.com/api"
});
