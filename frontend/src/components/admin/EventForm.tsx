"use client";

import { useEffect, useRef } from "react";
import { useFormState } from "react-dom";
import { createEventAction } from "@/actions/events";
import { Field } from "@/components/ui/Field";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { DateTimeField } from "../ui/DateTimeField";

export function EventForm() {
  const [state, action] = useFormState(createEventAction, {});
  const ref = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (state.ok) ref.current?.reset();
  }, [state]);

  return (
    <form ref={ref} action={action}>
      <Field label="Tiêu đề" name="title" required />
      <Field label="Địa điểm" name="location" />
      <div className="grid grid-cols-1 gap-3">
        <DateTimeField
          label="Bắt đầu"
          dateName="startDate"
          clockName="startClock"
          required
        />
        <DateTimeField
          label="Kết thúc (tùy chọn)"
          dateName="endDate"
          clockName="endClock"
        />
      </div>
      <label className="mt-3 block text-xs text-white/60" htmlFor="description">
        Mô tả
        <textarea
          id="description"
          name="description"
          rows={3}
          className="field mt-1 text-white"
        />
      </label>
      <p className="mt-2 min-h-5 text-sm text-red-300" role="alert">
        {state.error}
      </p>
      <SubmitButton>Thêm sự kiện</SubmitButton>
    </form>
  );
}
