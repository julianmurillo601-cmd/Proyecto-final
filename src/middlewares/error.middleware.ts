import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/app-error";

/** Middleware de errores (4 parámetros): convierte cualquier error en una respuesta uniforme. */
export function errorMiddleware(
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  // Errores controlados
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ ok: false, message: err.message });
    return;
  }

  // JSON mal formado enviado por el cliente (lo lanza express.json())
  if (typeof err === "object" && err !== null && (err as { type?: string }).type === "entity.parse.failed") {
    res.status(400).json({ ok: false, message: "Malformed JSON body" });
    return;
  }

  // Error inesperado -> 500, sin filtrar detalles internos al cliente
  console.error(
    `[${req.requestInfo?.timestamp ?? new Date().toISOString()}] Unexpected error on ${req.method} ${req.originalUrl}:`,
    err
  );
  res.status(500).json({ ok: false, message: "Internal server error" });
}
