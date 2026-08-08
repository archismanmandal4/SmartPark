import axios from "axios";

const API = axios.create({
    baseURL: "VITE_API_URL=https://smartpark-tvls.onrender.com/api",
});

export default API;