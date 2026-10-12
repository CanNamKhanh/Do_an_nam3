"use client";

import { useFormState } from "react-dom";
import { updateSettingsAction } from "@/actions/settings";
import { Field } from "@/components/ui/Field";
import { SubmitButton } from "@/components/ui/SubmitButton";
import type { Settings } from "@/services/settings.service";

export function SettingsForm({ settings }: { settings: Settings }) {
  const [state, action] = useFormState(updateSettingsAction, {});
  return (
    <form action={action}>
      <Field label="Tên cơ quan" name="agencyName" defaultValue={settings.agencyName} required />
      <Field label="Địa điểm" name="locationName" defaultValue={settings.locationName} required />
      <div className="grid grid-cols-2 gap-3">
        <Field label="Vĩ độ" name="latitude" type="number" step="any" defaultValue={settings.latitude} required />
        <Field label="Kinh độ" name="longitude" type="number" step="any" defaultValue={settings.longitude} required />
      </div>
      <p className={`mt-2 min-h-5 text-sm ${state.error ? "text-red-300" : "text-emerald-300"}`} role="status">
        {state.error ?? (state.ok ? "Đã lưu cài đặt." : "")}
      </p>
      <SubmitButton>Lưu cài đặt</SubmitButton>
    </form>
  );
}
