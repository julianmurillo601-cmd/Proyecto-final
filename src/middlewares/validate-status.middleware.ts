import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/app-error";
import { INCIDENT_STATUSES, IncidentStatus } from "../models/incident.model";

/** PATCH /:id/status -> solo OPEN, IN_PROGRESS y RESOLVED */
export function validateStatus(req: Request, _res: Response, next: NextFunction): void {
  const { status } = req.body ?? {};

  if (!INCIDENT_STATUSES.includes(status as IncidentStatus)) {
    return next(
      new AppError(400, `Invalid status. Allowed values: ${INCIDENT_STATUSES.join(", ")}`)
    );
  }
  next();
}
