import { IncidentPriority, IncidentStatus } from "../models/incident.model";

/**
 * DTO: los datos que el CLIENTE tiene permitido enviar en cada operación.
 * El cliente nunca controla id, status ni createdAt.
 */
export interface CreateIncidentDto {
  title: string;
  description: string;
  reporter: string;
  location: string;
  priority: IncidentPriority;
  estimatedMinutes: number;
}

/** PUT: no se puede cambiar id, reporter, status ni createdAt */
export interface UpdateIncidentDto {
  title: string;
  description: string;
  location: string;
  priority: IncidentPriority;
  estimatedMinutes: number;
}

/** PATCH /:id/status */
export interface UpdateIncidentStatusDto {
  status: IncidentStatus;
}
