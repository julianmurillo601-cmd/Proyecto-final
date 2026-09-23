import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/app-error";

/** Middleware 404 global: se registra después de todas las rutas. */
export function notFoundMiddleware(_req: Request, _res: Response, next: NextFunction): void {
  next(new AppError(404, "Route not found"));
}
