import axios from "axios";

import {
  API_BASE_URL,
} from "../config/api";


const apiClient = axios.create({
  baseURL: API_BASE_URL,
});


apiClient.interceptors.request.use(
  (config) => {

    const isAdminRequest =
      config.url?.startsWith("/admin");

    const token = localStorage.getItem(
      isAdminRequest
        ? "glowryAdminToken"
        : "glowryToken"
    );


    if (token) {

      config.headers.Authorization =
        `Bearer ${token}`;

    }


    return config;

  },

  (error) => {

    return Promise.reject(error);

  }
);


export default apiClient;