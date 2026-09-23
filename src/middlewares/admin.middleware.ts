import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/app-error";

/** Autorización: ¿puedes hacerlo? -> 403 si no eres administrador. Debe ir DESPUÉS de auth. */
export function adminMiddleware(req: Request, _res: Response, next: NextFunction): void {
  if (req.user?.role !== "admin") {
    return next(new AppError(403, "Administrator permissions required"));
  }
  next();
}
