/**
 * MODEL: cómo existe un incidente DENTRO de la aplicación.
 * Incluye los campos que genera el servidor (id, status, createdAt).
 */
export const INCIDENT_PRIORITIES = ["LOW", "MEDIUM", "HIGH", "CRITICAL"] as const;
export const INCIDENT_STATUSES = ["OPEN", "IN_PROGRESS", "RESOLVED"] as const;

export type IncidentPriority = (typeof INCIDENT_PRIORITIES)[number];
export type IncidentStatus = (typeof INCIDENT_STATUSES)[number];

export interface Incident {
  id: number;
  title: string;
  description: string;
  reporter: string;
  location: string;
  priority: IncidentPriority;
  status: IncidentStatus;
  estimatedMinutes: number;
  createdAt: string;
}

/** Reglas de negocio ligadas al modelo */
export const MAX_ESTIMATED_MINUTES = 480;
export const CRITICAL_MAX_MINUTES = 60;

/** Reto 5: transiciones de estado permitidas */
export const STATUS_TRANSITIONS: Record<IncidentStatus, IncidentStatus[]> = {
  OPEN: ["IN_PROGRESS", "RESOLVED"],
  IN_PROGRESS: ["RESOLVED"],
  RESOLVED: []
};
