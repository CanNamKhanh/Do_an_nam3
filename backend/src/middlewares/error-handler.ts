import { Prisma } from "@prisma/client";
import type { ErrorRequestHandler, NextFunction, Request, RequestHandler, Response } from "express";
import { ZodError } from "zod";
import { HttpError } from "../lib/http-error";

const PRISMA_NOT_FOUND = "P2025";
const PRISMA_UNIQUE_VIOLATION = "P2002";

export const notFoundHandler: RequestHandler = (_req, res) => {
  res.status(404).json({ message: "Không tìm thấy đường dẫn" });
};

export const errorHandler: ErrorRequestHandler = (err: unknown, _req: Request, res: Response, _next: NextFunction): void => {
  if (err instanceof ZodError) {
    res.status(400).json({
      message: err.issues[0]?.message ?? "Dữ liệu không hợp lệ",
      issues: err.issues.map((issue) => ({ path: issue.path.join("."), message: issue.message })),
    });
    return;
  }

  if (err instanceof HttpError) {
    res.status(err.status).json({ message: err.message });
    return;
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === PRISMA_NOT_FOUND) {
      res.status(404).json({ message: "Không tìm thấy dữ liệu" });
      return;
    }
    if (err.code === PRISMA_UNIQUE_VIOLATION) {
      res.status(409).json({ message: "Dữ liệu đã tồn tại" });
      return;
    }
  }

  console.error(err);
  res.status(500).json({ message: "Lỗi máy chủ nội bộ" });
};
