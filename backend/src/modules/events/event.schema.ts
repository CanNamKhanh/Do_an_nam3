import { z } from "zod";

const dateTime = z
  .string()
  .datetime({
    offset: true,
    message: "Thời gian không hợp lệ (cần định dạng ISO 8601)",
  })
  .transform((value) => new Date(value));

/** Chuỗi rỗng được coi như không có giá trị. */
const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max, `Tối đa ${max} ký tự`)
    .transform((value) => (value === "" ? null : value))
    .nullable()
    .optional();

export const RANGE_ERROR = "Giờ kết thúc phải sau giờ bắt đầu";

export function isValidRange(
  start: Date,
  end: Date | null | undefined,
): boolean {
  return end === null || end === undefined || end >= start;
}

const eventFields = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Nhập tiêu đề")
    .max(255, "Tiêu đề tối đa 255 ký tự"),
  description: optionalText(5000),
  location: optionalText(255),
  startTime: dateTime,
  endTime: dateTime.nullable().optional(),
  isActive: z.boolean().optional(),
});

export const createEventSchema = eventFields.refine(
  (v) => isValidRange(v.startTime, v.endTime),
  {
    message: RANGE_ERROR,
    path: ["endTime"],
  },
);

export const updateEventSchema = eventFields
  .partial()
  .refine((v) => Object.keys(v).length > 0, {
    message: "Cần ít nhất một trường để cập nhật",
  });

export const listEventsQuerySchema = z.object({
  isActive: z
    .enum(["true", "false"])
    .transform((value) => value === "true")
    .optional(),
  from: dateTime.optional(),
  to: dateTime.optional(),
});

export const eventIdParamSchema = z.object({
  id: z.coerce.number().int().positive("Mã sự kiện không hợp lệ"),
});
export const publicEventsQuerySchema = z.object({
  from: dateTime,
  to: dateTime,
});
export type PublicEventsQuery = z.infer<typeof publicEventsQuerySchema>;
export type CreateEventInput = z.infer<typeof createEventSchema>;
export type UpdateEventInput = z.infer<typeof updateEventSchema>;
export type ListEventsQuery = z.infer<typeof listEventsQuerySchema>;
