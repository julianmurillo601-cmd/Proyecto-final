import { Incident } from "../models/incident.model";

const hoursAgo = (h: number): string =>
  new Date(Date.now() - h * 60 * 60 * 1000).toISOString();

/** "Base de datos" en memoria */
export const incidents: Incident[] = [
  {
    id: 1,
    title: "Proyector sin señal",
    description: "El proyector no reconoce ningún computador conectado.",
    reporter: "Carlos Díaz",
    location: "Aula 201",
    priority: "MEDIUM",
    status: "OPEN",
    estimatedMinutes: 30,
    createdAt: hoursAgo(10)
  },
  {
    id: 2,
    title: "Servidor de archivos sin respuesta",
    description: "Nadie puede acceder a las carpetas compartidas del área administrativa.",
    reporter: "Sandra Ruiz",
    location: "Sala de servidores",
    priority: "CRITICAL",
    status: "IN_PROGRESS",
    estimatedMinutes: 60,
    createdAt: hoursAgo(8)
  },
  {
    id: 3,
    title: "Impresora con papel atascado",
    description: "La impresora multifuncional muestra error de atasco constante.",
    reporter: "Julián Pérez",
    location: "Oficina 105",
    priority: "LOW",
    status: "OPEN",
    estimatedMinutes: 20,
    createdAt: hoursAgo(6)
  },
  {
    id: 4,
    title: "Aplicación de nómina se cierra sola",
    description: "El sistema de nómina se cierra al intentar generar reportes mensuales.",
    reporter: "Marcela Rojas",
    location: "Recursos Humanos",
    priority: "HIGH",
    status: "IN_PROGRESS",
    estimatedMinutes: 120,
    createdAt: hoursAgo(5)
  },
  {
    id: 5,
    title: "Teclado sin respuesta",
    description: "Varias teclas del teclado del laboratorio no funcionan.",
    reporter: "Andrés Vega",
    location: "Laboratorio 102",
    priority: "LOW",
    status: "RESOLVED",
    estimatedMinutes: 15,
    createdAt: hoursAgo(3)
  },
  {
    id: 6,
    title: "Sin acceso a Internet en toda la sede",
    description: "Ningún equipo de la sede logra navegar; el enlace principal parece caído.",
    reporter: "Laura Gómez",
    location: "Sede principal",
    priority: "CRITICAL",
    status: "OPEN",
    estimatedMinutes: 45,
    createdAt: hoursAgo(1)
  }
];

let lastId = incidents.reduce((max, i) => Math.max(max, i.id), 0);

/** Los IDs nunca se reutilizan, aunque se elimine un incidente. */
export const generateId = (): number => ++lastId;
