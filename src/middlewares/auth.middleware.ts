import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/app-error";

type AuthUser = NonNullable<Request["user"]>;

/** Tokens simulados (no se usa JWT en esta versión) */
const TOKENS = new Map<string, AuthUser>([
  ["instructor-token", { name: "instructor", role: "admin" }],
  ["technician-token", { name: "technician", role: "technician" }]
]);

/** Autenticación: ¿quién eres? -> 401 si no hay header o el token es incorrecto */
export function authMiddleware(req: Request, _res: Response, next: NextFunction): void {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return next(new AppError(401, "Authentication required"));
  }

  const user = TOKENS.get(header.slice("Bearer ".length).trim());
  if (!user) {
    return next(new AppError(401, "Invalid token"));
  }

  req.user = user;
  next();
}
