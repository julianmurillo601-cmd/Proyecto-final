export {};

declare global {
  namespace Express {
    interface Request {
      /** Agregado por request-info.middleware */
      requestInfo?: {
        timestamp: string;
        method: string;
        path: string;
      };
      /** Agregado por auth.middleware */
      user?: {
        name: string;
        role: "admin" | "technician";
      };
    }
  }
}
