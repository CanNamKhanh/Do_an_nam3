import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/LoginForm";
import { getSession } from "@/lib/auth";

export default async function LoginPage() {
  if (await getSession()) redirect("/admin");
  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-4">
      <h1 className="text-xl font-semibold">Đăng nhập quản trị</h1>
      <p className="mb-6 mt-1 text-sm text-white/60">
        Chỉ tài khoản ADMIN mới chỉnh được lịch và cài đặt.
      </p>
      <LoginForm />
    </main>
  );
}
