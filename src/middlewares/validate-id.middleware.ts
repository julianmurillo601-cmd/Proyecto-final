import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/app-error";

/** :id debe ser un entero positivo. Inválidos: abc, -3, 4.5, 0 */
export function validateId(req: Request, _res: Response, next: NextFunction): void {
  const id = req.params.id;

  if (typeof id !== "string" || !/^[1-9]\d*$/.test(id) || !Number.isSafeInteger(Number(id))) {
    return next(new AppError(400, "Invalid incident id"));
  }
  next();
}
