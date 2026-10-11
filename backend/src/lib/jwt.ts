import { jwtVerify, SignJWT, type JWTPayload } from "jose";
import { env } from "../config/env";
import { HttpError } from "./http-error";

const secret = new TextEncoder().encode(env.JWT_SECRET);
const ALGORITHM = "HS256";

export function signAccessToken(userId: number): Promise<string> {
  return new SignJWT({})
    .setProtectedHeader({ alg: ALGORITHM })
    .setSubject(String(userId))
    .setIssuedAt()
    .setExpirationTime(env.JWT_EXPIRES_IN)
    .sign(secret);
}

/** Trả về id người dùng nếu token hợp lệ, ngược lại ném 401. */
export async function verifyAccessToken(token: string): Promise<number> {
  let payload: JWTPayload;
  try {
    ({ payload } = await jwtVerify(token, secret, { algorithms: [ALGORITHM] }));
  } catch {
    throw HttpError.unauthorized("Token không hợp lệ hoặc đã hết hạn");
  }

  const userId = Number(payload.sub);
  if (!Number.isInteger(userId)) {
    throw HttpError.unauthorized("Token không hợp lệ");
  }
  return userId;
}
