const LOCAL_API = "http://127.0.0.1:8000"
const CLOUD_API = "https://coches-saas.onrender.com"

export const API_URL =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
    ? LOCAL_API
    : CLOUD_API
