import { Request, Response, NextFunction } from "express";

/** Registra cada petición: [fecha ISO] MÉTODO ruta */
export function logger(req: Request, _res: Response, next: NextFunction): void {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
}
