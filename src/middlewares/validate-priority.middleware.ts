import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/app-error";
import { INCIDENT_PRIORITIES, IncidentPriority } from "../models/incident.model";

/** Solo LOW, MEDIUM, HIGH y CRITICAL */
export function validatePriority(req: Request, _res: Response, next: NextFunction): void {
  const { priority } = req.body ?? {};

  if (!INCIDENT_PRIORITIES.includes(priority as IncidentPriority)) {
    return next(
      new AppError(400, `Invalid priority. Allowed values: ${INCIDENT_PRIORITIES.join(", ")}`)
    );
  }
  next();
}
