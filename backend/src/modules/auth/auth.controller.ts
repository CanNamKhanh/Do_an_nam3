import type { Request, Response } from "express";
import { getAuthUser } from "../../middlewares/authenticate";
import { loginSchema } from "./auth.schema";
import * as authService from "./auth.service";

export async function login(req: Request, res: Response): Promise<void> {
  const input = loginSchema.parse(req.body);
  const { accessToken, user } = await authService.login(input);
  res.json({ access_token: accessToken, token_type: "bearer", user });
}

export function me(req: Request, res: Response): void {
  res.json(getAuthUser(req));
}
