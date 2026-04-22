import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",
  // const API_URL = "https://backend-9qjw.onrender.com";
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    // config.headers.Authorization = token;
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Função genérica
const request = async ({
  method,
  url,
  data = null,
  headers = {},
  responseType = "json",
}) => {
  try {
    const response = await api({
      method,
      url,
      data,
      headers,
      responseType,
    });

    return response.data;
  } catch (error) {
    console.error("Erro na requisição:", error);
    throw error;
  }
};

export default request;
