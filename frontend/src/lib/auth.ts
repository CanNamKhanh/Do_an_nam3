import { cookies } from "next/headers";
import { SESSION_COOKIE } from "@/lib/http/server";
import * as authService from "@/services/auth.service";
import type { Session } from "@/types/auth";

/** Token do backend cấp; FE chỉ giữ trong cookie httpOnly. */
export function setSessionToken(token: string) {
  cookies().set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
}

export const destroySession = () => cookies().delete(SESSION_COOKIE);

/** Hỏi backend xem token còn hợp lệ không (backend là nơi duy nhất xác thực). */
export async function getSession(): Promise<Session | null> {
  if (!cookies().get(SESSION_COOKIE)) return null;
  try {
    return await authService.me();
  } catch {
    return null;
  }
}

export async function requireAdmin(): Promise<Session> {
  const s = await getSession();
  if (!s) throw new Error("Bạn cần đăng nhập để thực hiện thao tác này");
  return s;
}
