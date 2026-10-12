import Link from "next/link";
import { redirect } from "next/navigation";
import { logoutAction } from "@/actions/auth";
import { EventForm } from "@/components/admin/EventForm";
import { EventTable } from "@/components/admin/EventTable";
import { SettingsForm } from "@/components/admin/SettingsForm";
import { getSession } from "@/lib/auth";
import { listEvents } from "@/services/events.service";
import { getSettings } from "@/services/settings.service";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!(await getSession())) redirect("/admin/login");
  const [events, settings] = await Promise.all([listEvents(), getSettings()]);

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <header className="mb-8 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Quản trị bảng thông tin</h1>
        <div className="flex gap-2">
          <Link href="/" className="btn">
            Xem bảng
          </Link>
          <form action={logoutAction}>
            <button className="btn cursor-pointer" type="submit">
              Đăng xuất
            </button>
          </form>
        </div>
      </header>
      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <div className="space-y-6">
          <section className="panel p-5">
            <h2 className="mb-3 font-semibold">Thêm sự kiện</h2>
            <EventForm />
          </section>
          <section className="panel p-5">
            <h2 className="mb-3 font-semibold">Cài đặt chung</h2>
            <SettingsForm settings={settings} />
          </section>
        </div>
        <section className="panel p-5">
          <h2 className="mb-3 font-semibold">Tất cả sự kiện</h2>
          <EventTable events={events} />
        </section>
      </div>
    </main>
  );
}
