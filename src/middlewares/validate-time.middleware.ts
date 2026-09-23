import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/app-error";
import { CRITICAL_MAX_MINUTES, MAX_ESTIMATED_MINUTES } from "../models/incident.model";

/**
 * estimatedMinutes: numérico, > 0 y <= 480.
 *
 * RETO 4 (CRITICAL <= 60 min): se implementa AQUÍ porque es una regla sobre
 * el tiempo estimado, y validatePriority ya se ejecutó antes, así que
 * priority llega garantizada y solo se compara. Ver README.
 */
export function validateTime(req: Request, _res: Response, next: NextFunction): void {
  const { estimatedMinutes, priority } = req.body ?? {};

  if (typeof estimatedMinutes !== "number" || !Number.isFinite(estimatedMinutes)) {
    return next(new AppError(400, "estimatedMinutes must be a number"));
  }
  if (estimatedMinutes <= 0) {
    return next(new AppError(400, "estimatedMinutes must be greater than 0"));
  }
  if (estimatedMinutes > MAX_ESTIMATED_MINUTES) {
    return next(new AppError(400, `estimatedMinutes cannot exceed ${MAX_ESTIMATED_MINUTES} minutes`));
  }
  if (priority === "CRITICAL" && estimatedMinutes > CRITICAL_MAX_MINUTES) {
    return next(
      new AppError(400, `CRITICAL incidents cannot exceed ${CRITICAL_MAX_MINUTES} estimated minutes`)
    );
  }
  next();
}
