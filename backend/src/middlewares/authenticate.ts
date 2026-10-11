import type { Request, RequestHandler } from "express";
import { HttpError } from "../lib/http-error";
import { verifyAccessToken } from "../lib/jwt";
import { findPublicUser, type PublicUser } from "../modules/auth/auth.service";

const BEARER_PREFIX = "Bearer ";

function extractBearerToken(header: string | undefined): string | null {
  return header?.startsWith(BEARER_PREFIX) ? header.slice(BEARER_PREFIX.length) : null;
}

/** Express 5 tự chuyển lỗi từ hàm async sang errorHandler. */
export const authenticate: RequestHandler = async (req, _res, next) => {
  const token = extractBearerToken(req.header("authorization"));
  if (token === null) {
    throw HttpError.unauthorized("Thiếu token đăng nhập");
  }

  const user = await findPublicUser(await verifyAccessToken(token));
  if (user === null) {
    throw HttpError.unauthorized("Tài khoản không còn tồn tại");
  }

  req.user = user;
  next();
};

/** Dùng trong handler đã đứng sau `authenticate`. */
export function getAuthUser(req: Request): PublicUser {
  if (req.user === undefined) {
    throw HttpError.unauthorized("Chưa đăng nhập");
  }
  return req.user;
}
