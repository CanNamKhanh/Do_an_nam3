import type { Prisma } from "@prisma/client";
import { HttpError } from "../../lib/http-error";
import { signAccessToken } from "../../lib/jwt";
import { verifyPassword } from "../../lib/password";
import { prisma } from "../../lib/prisma";
import type { LoginInput } from "./auth.schema";

const publicUserSelect = { id: true, email: true, name: true } satisfies Prisma.UserSelect;

export type PublicUser = Prisma.UserGetPayload<{ select: typeof publicUserSelect }>;

export interface LoginResult {
  accessToken: string;
  user: PublicUser;
}

const INVALID_CREDENTIALS = "Email hoặc mật khẩu chưa đúng";

export async function login({ email, password }: LoginInput): Promise<LoginResult> {
  const account = await prisma.user.findUnique({ where: { email } });
  const passwordMatches = account !== null && (await verifyPassword(password, account.hashedPassword));
  if (account === null || !passwordMatches) {
    throw HttpError.unauthorized(INVALID_CREDENTIALS);
  }

  const accessToken = await signAccessToken(account.id);
  return { accessToken, user: { id: account.id, email: account.email, name: account.name } };
}

export function findPublicUser(id: number): Promise<PublicUser | null> {
  return prisma.user.findUnique({ where: { id }, select: publicUserSelect });
}
