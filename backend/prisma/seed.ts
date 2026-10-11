import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { z } from "zod";

const seedEnv = z
  .object({
    ADMIN_EMAIL: z.string().email(),
    ADMIN_PASSWORD: z.string().min(8, "Mật khẩu admin tối thiểu 8 ký tự"),
  })
  .parse(process.env);

const prisma = new PrismaClient();

async function main(): Promise<void> {
  const email = seedEnv.ADMIN_EMAIL.toLowerCase();
  const hashedPassword = await bcrypt.hash(seedEnv.ADMIN_PASSWORD, 12);
  await prisma.user.upsert({
    where: { email },
    update: { hashedPassword },
    create: { email, hashedPassword, name: "Quản trị viên" },
  });
  console.log(`Đã tạo/cập nhật tài khoản admin: ${email}`);
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
