"use client";

import { useFormState } from "react-dom";
import { loginAction } from "@/actions/auth";
import { Field } from "@/components/ui/Field";
import { SubmitButton } from "@/components/ui/SubmitButton";

export function LoginForm() {
  const [state, action] = useFormState(loginAction, {});
  return (
    <form action={action} className="panel p-5">
      <Field label="Email" name="email" type="email" required autoComplete="username" />
      <Field label="Mật khẩu" name="password" type="password" required autoComplete="current-password" />
      <p className="mt-3 min-h-5 text-sm text-red-300" role="alert">{state.error}</p>
      <SubmitButton>Đăng nhập</SubmitButton>
    </form>
  );
}
