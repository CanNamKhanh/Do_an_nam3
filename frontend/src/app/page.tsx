import { Dashboard } from "@/components/dashboard/Dashboard";
import { safeFetchDisplay } from "@/services/backend.service";
import { getSettings } from "@/services/settings.service";

export const dynamic = "force-dynamic";

/** ?preview=63 để xem thử nền (0 quang, 3 mây, 45 sương, 63 mưa, 75 tuyết, 95 bão). */
export default async function HomePage({ searchParams }: { searchParams: { preview?: string } }) {
  const [initial, settings] = await Promise.all([safeFetchDisplay(), getSettings()]);
  const preview = searchParams.preview !== undefined ? Number(searchParams.preview) : undefined;
  return <Dashboard initial={initial} agencyName={settings.agencyName} previewCode={Number.isFinite(preview) ? preview : undefined} />;
}
