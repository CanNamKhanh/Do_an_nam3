import axios from "axios";
import { cookies } from "next/headers";

export const SESSION_COOKIE = "session";

// Express: đăng nhập, sự kiện, cài đặt
const backendURL = process.env.BACKEND_API_URL ?? "http://localhost:4000/api";
// Python: GET /display
const displayURL = process.env.DISPLAY_API_URL ?? "http://localhost:8000/api";

export const backendClient = axios.create({
  baseURL: backendURL,
  timeout: 8_000,
});
export const displayClient = axios.create({
  baseURL: displayURL,
  timeout: 8_000,
});

export function authedClient(token?: string) {
  const t = token ?? cookies().get(SESSION_COOKIE)?.value;
  return axios.create({
    baseURL: backendURL,
    timeout: 8_000,
    headers: t ? { Authorization: `Bearer ${t}` } : {},
  });
}
