import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Email chưa đúng định dạng"),
  password: z.string().min(1, "Nhập mật khẩu"),
});

export type LoginInput = z.infer<typeof loginSchema>;
