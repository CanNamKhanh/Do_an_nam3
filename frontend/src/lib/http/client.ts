import axios from "axios";

/** Axios cho trình duyệt: gọi route proxy của Next (cùng origin, không dính CORS). */
export const apiClient = axios.create({ baseURL: "/api", timeout: 10_000 });
