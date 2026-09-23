import { Request, Response, NextFunction } from "express";

/** Enriquece el Request con información adicional para los siguientes componentes. */
export function requestInfo(req: Request, _res: Response, next: NextFunction): void {
  req.requestInfo = {
    timestamp: new Date().toISOString(),
    method: req.method,
    path: req.path
  };
  next();
}
