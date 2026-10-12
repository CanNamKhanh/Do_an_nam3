import { authedClient, backendClient } from "@/lib/http/server";
import type { Session } from "@/types/auth";

/** POST /auth/login -> { access_token } */
export async function login(email: string, password: string) {
  const { data } = await backendClient.post<{ access_token: string }>("/auth/login", { email, password });
  return data;
}

/** GET /auth/me -> Session */
export async function me(token?: string) {
  const { data } = await authedClient(token).get<Session>("/auth/me");
  return data;
}
