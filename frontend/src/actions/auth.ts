"use server";

import axios from "axios";
import { redirect } from "next/navigation";
import { z } from "zod";
import { destroySession, setSessionToken } from "@/lib/auth";
import { errorMessage } from "@/lib/http/errors";
import * as authService from "@/services/auth.service";
import type { ActionState } from "@/types/action";

const schema = z.object({
  email: z.string().email("Email chưa đúng định dạng"),
  password: z.string().min(1, "Nhập mật khẩu"),
});

export async function loginAction(
  _: ActionState,
  fd: FormData,
): Promise<ActionState> {
  const parsed = schema.safeParse(Object.fromEntries(fd));
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  try {
    const { access_token } = await authService.login(
      parsed.data.email,
      parsed.data.password,
    );
    setSessionToken(access_token);
  } catch (e) {
    console.error("[login]", e instanceof Error ? e.message : e);
    const wrongCredentials =
      axios.isAxiosError(e) && e.response?.status === 401;
    return {
      error: wrongCredentials
        ? "Email hoặc mật khẩu chưa đúng."
        : errorMessage(e),
    };
  }
  redirect("/admin");
}

export async function logoutAction() {
  destroySession();
  redirect("/admin/login");
}
