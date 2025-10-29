import axios from "axios";

const apiClient = axios.create({
    baseURL: "http://127.0.0.1:8080",
});

const token = localStorage.getItem("token");


export const searchProducts = (query) => {
    return apiClient.get(`/products/search?query=${encodeURIComponent(query)}`);
};

export default apiClient;