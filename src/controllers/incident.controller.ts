import { Request, Response } from "express";
import { incidents, generateId } from "../data/incidents.data";
import { CreateIncidentDto, UpdateIncidentDto, UpdateIncidentStatusDto } from "../dtos/incident.dto";
import { AppError } from "../errors/app-error";
import { Incident, STATUS_TRANSITIONS } from "../models/incident.model";

/** Busca un incidente o lanza AppError 404 (el error middleware arma la respuesta). */
function findIncidentOrFail(idParam: string): Incident {
  const incident = incidents.find((i) => i.id === Number(idParam));
  if (!incident) {
    throw new AppError(404, "Incident not found");
  }
  return incident;
}

// GET /api/incidents
export function getAllIncidents(_req: Request, res: Response): void {
  res.status(200).json({ ok: true, total: incidents.length, data: incidents });
}

// GET /api/incidents/:id
export function getIncidentById(req: Request, res: Response): void {
  const incident = findIncidentOrFail(req.params.id as string);
  res.status(200).json({ ok: true, data: incident });
}

// POST /api/incidents
export function createIncident(req: Request, res: Response): void {
  const dto = req.body as CreateIncidentDto;

  // Solo se copian los campos del DTO; el servidor genera id, status y createdAt.
  const incident: Incident = {
    id: generateId(),
    title: dto.title.trim(),
    description: dto.description.trim(),
    reporter: dto.reporter.trim(),
    location: dto.location.trim(),
    priority: dto.priority,
    status: "OPEN",
    estimatedMinutes: dto.estimatedMinutes,
    createdAt: new Date().toISOString()
  };

  incidents.push(incident);
  res.status(201).json({ ok: true, message: "Incident created", data: incident });
}

// PUT /api/incidents/:id
export function updateIncident(req: Request, res: Response): void {
  const incident = findIncidentOrFail(req.params.id as string);
  const dto = req.body as UpdateIncidentDto;

  incident.title = dto.title.trim();
  incident.description = dto.description.trim();
  incident.location = dto.location.trim();
  incident.priority = dto.priority;
  incident.estimatedMinutes = dto.estimatedMinutes;
  // id, reporter, status y createdAt no se tocan.

  res.status(200).json({ ok: true, message: "Incident updated", data: incident });
}

// PATCH /api/incidents/:id/status
export function updateIncidentStatus(req: Request, res: Response): void {
  const incident = findIncidentOrFail(req.params.id as string);
  const { status: newStatus } = req.body as UpdateIncidentStatusDto;

  // Reto 5: regla de transición de estados
  if (!STATUS_TRANSITIONS[incident.status].includes(newStatus)) {
    throw new AppError(400, `Invalid status transition: ${incident.status} -> ${newStatus}`);
  }

  incident.status = newStatus;
  res.status(200).json({ ok: true, message: "Incident status updated", data: incident });
}

// DELETE /api/incidents/:id
export function deleteIncident(req: Request, res: Response): void {
  const incident = findIncidentOrFail(req.params.id as string);
  incidents.splice(incidents.indexOf(incident), 1);
  res.status(204).send();
}

// GET /api/incidents/critical  (Reto 1)
export function getCriticalIncidents(_req: Request, res: Response): void {
  const data = incidents.filter((i) => i.priority === "CRITICAL");
  res.status(200).json({ ok: true, total: data.length, data });
}

// GET /api/incidents/pending  (Reto 2)
export function getPendingIncidents(_req: Request, res: Response): void {
  const data = incidents.filter((i) => i.status === "OPEN" || i.status === "IN_PROGRESS");
  res.status(200).json({ ok: true, total: data.length, data });
}

// GET /api/incidents/stats  (Reto 3) - todo calculado dinámicamente
export function getIncidentStats(_req: Request, res: Response): void {
  const total = incidents.length;
  const totalMinutes = incidents.reduce((sum, i) => sum + i.estimatedMinutes, 0);

  res.status(200).json({
    ok: true,
    data: {
      total,
      open: incidents.filter((i) => i.status === "OPEN").length,
      inProgress: incidents.filter((i) => i.status === "IN_PROGRESS").length,
      resolved: incidents.filter((i) => i.status === "RESOLVED").length,
      critical: incidents.filter((i) => i.priority === "CRITICAL").length,
      averageEstimatedMinutes: total === 0 ? 0 : Math.round(totalMinutes / total)
    }
  });
}
