import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/app-error";

const isNonEmptyString = (value: unknown): boolean =>
  typeof value === "string" && value.trim().length > 0;

/**
 * Valida que los campos obligatorios existan y tengan el tipo correcto.
 * El valor concreto de priority y estimatedMinutes lo revisan
 * validatePriority y validateTime (una responsabilidad por middleware).
 */
function validateFields(requiredTexts: string[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const body = req.body;

    if (body === undefined || body === null || typeof body !== "object" || Array.isArray(body)) {
      return next(new AppError(400, "Request body must be a JSON object"));
    }

    for (const field of requiredTexts) {
      if (!isNonEmptyString(body[field])) {
        return next(new AppError(400, `${field} is required and must be a non-empty string`));
      }
    }
    if (body.priority === undefined || body.priority === null) {
      return next(new AppError(400, "priority is required"));
    }
    if (body.estimatedMinutes === undefined || body.estimatedMinutes === null) {
      return next(new AppError(400, "estimatedMinutes is required"));
    }
    next();
  };
}

/** POST: title, description, reporter, location, priority, estimatedMinutes */
export const validateCreateIncident = validateFields(["title", "description", "reporter", "location"]);

/** PUT: igual, pero reporter no se puede modificar */
export const validateUpdateIncident = validateFields(["title", "description", "location"]);
