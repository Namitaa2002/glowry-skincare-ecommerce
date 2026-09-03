const SERVER_BASE_URL =
  import.meta.env.VITE_API_URL;

const API_BASE_URL =
  `${SERVER_BASE_URL}/api`;

export {
  API_BASE_URL,
  SERVER_BASE_URL,
};