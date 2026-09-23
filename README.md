# IncidentHub API

## Problema que soluciona

En la organización los incidentes tecnológicos (computadores que no encienden, fallas de red, impresoras, aplicaciones caídas) se reportan por llamadas y mensajes informales, así que no hay control ni trazabilidad. **IncidentHub API** es una primera versión de una API REST que permite registrar, consultar, modificar, atender y eliminar incidentes, con reglas de validación, autenticación y autorización.

## Tecnologías

- Node.js
- Express 5
- TypeScript
- Persistencia en memoria (arreglo `incidents`, sin base de datos)

## Instalación y ejecución

```bash
npm install
npm run dev        # modo desarrollo en http://localhost:3000
```

Otros comandos:

```bash
npm run build      # compila a dist/
npm start          # ejecuta la versión compilada
npm run test:api   # ejecuta las pruebas con cURL (el servidor debe estar corriendo)
```

## Estructura del proyecto

```
src/
├── controllers/   incident.controller.ts   -> lógica de cada endpoint
├── data/          incidents.data.ts        -> arreglo en memoria + generador de IDs
├── dtos/          incident.dto.ts          -> datos que el cliente puede enviar
├── errors/        app-error.ts             -> error controlado con código HTTP
├── middlewares/   auth, admin, error, logger, not-found, request-info,
│                  validate-id, validate-incident, validate-priority,
│                  validate-time, validate-status
├── models/        incident.model.ts        -> cómo vive el incidente dentro de la app
├── routes/        incident.routes.ts       -> URL + orden de middlewares + controller
├── types/         express.d.ts             -> amplía Request (requestInfo, user)
├── app.ts         configuración de Express (middlewares globales y rutas)
└── server.ts      arranque del servidor (listen)
```

## Autenticación

Los endpoints de escritura requieren el header `Authorization`:

| Token | Rol | Puede |
|---|---|---|
| `Bearer instructor-token` | Administrador | GET, POST, PUT, PATCH, DELETE |
| `Bearer technician-token` | Técnico | GET, POST, PUT, PATCH |

Los `GET` son públicos. Sin header o con token incorrecto → `401`. Técnico intentando `DELETE` → `403`.

## Endpoints

| Método | Ruta | Auth | Respuestas |
|---|---|---|---|
| GET | `/api/incidents` | No | 200 |
| GET | `/api/incidents/:id` | No | 200 / 400 / 404 |
| POST | `/api/incidents` | Token | 201 / 400 / 401 |
| PUT | `/api/incidents/:id` | Token | 200 / 400 / 401 / 404 |
| PATCH | `/api/incidents/:id/status` | Token | 200 / 400 / 401 / 404 |
| DELETE | `/api/incidents/:id` | Solo admin | 204 / 400 / 401 / 403 / 404 |
| GET | `/api/incidents/critical` | No | 200 |
| GET | `/api/incidents/pending` | No | 200 |
| GET | `/api/incidents/stats` | No | 200 |

### Ejemplos

**POST /api/incidents** (el servidor agrega `id`, `status: "OPEN"` y `createdAt`)

```bash
curl -X POST http://localhost:3000/api/incidents \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer technician-token" \
  -d '{
    "title": "Router sin conectividad",
    "description": "El router del segundo piso perdió conexión.",
    "reporter": "Ana Torres",
    "location": "Piso 2",
    "priority": "HIGH",
    "estimatedMinutes": 40
  }'
```

**PUT /api/incidents/:id** (no se pueden modificar `id`, `reporter`, `status` ni `createdAt`)

```json
{
  "title": "Pantalla sin imagen",
  "description": "El monitor dejó completamente de mostrar imagen.",
  "location": "Oficina 407",
  "priority": "HIGH",
  "estimatedMinutes": 60
}
```

**PATCH /api/incidents/:id/status**

```json
{ "status": "IN_PROGRESS" }
```

Transiciones permitidas: `OPEN → IN_PROGRESS → RESOLVED` y `OPEN → RESOLVED`. Cualquier otra (por ejemplo `RESOLVED → OPEN`) devuelve `400`.

**DELETE /api/incidents/:id**

```bash
curl -X DELETE http://localhost:3000/api/incidents/3 -H "Authorization: Bearer instructor-token"
```

**GET /api/incidents/stats** (calculado dinámicamente)

```json
{
  "ok": true,
  "data": { "total": 6, "open": 3, "inProgress": 2, "resolved": 1, "critical": 2, "averageEstimatedMinutes": 48 }
}
```

### Formato de errores (siempre igual)

```json
{ "ok": false, "message": "Incident not found" }
```

## Middlewares

| Middleware | Qué hace |
|---|---|
| `logger` | Imprime `[fecha ISO] MÉTODO ruta` de cada petición. |
| `requestInfo` | Agrega `req.requestInfo` (timestamp, método, path) para los siguientes componentes. |
| `authMiddleware` | Lee `Authorization: Bearer <token>`. Si falta o es incorrecto lanza 401; si es válido guarda el usuario en `req.user`. |
| `adminMiddleware` | Revisa `req.user.role`. Si no es admin lanza 403. Va siempre después de auth. |
| `validateId` | Verifica que `:id` sea un entero positivo (rechaza `abc`, `-3`, `4.5`, `0`) → 400. |
| `validateCreateIncident` / `validateUpdateIncident` | Verifican que los campos obligatorios existan y sean texto no vacío (POST exige `reporter`, PUT no). |
| `validatePriority` | Solo permite `LOW`, `MEDIUM`, `HIGH`, `CRITICAL`. |
| `validateTime` | `estimatedMinutes` numérico, mayor que 0 y máximo 480. También aplica la regla del Reto 4. |
| `validateStatus` | Solo permite `OPEN`, `IN_PROGRESS`, `RESOLVED` en el PATCH. |
| `notFoundMiddleware` | Si ninguna ruta coincidió, crea un `AppError(404, "Route not found")`. |
| `errorMiddleware` | Recibe todos los errores y arma la respuesta `{ ok:false, message }`. Los `AppError` usan su código; JSON mal formado da 400; cualquier otro error inesperado da 500 sin exponer detalles. |

### Orden de ejecución

```
Logger → RequestInfo → express.json → Router → Auth → Validate ID → Validate Incident
→ Validate Priority → Validate Time → Controller → Data → Respuesta
                     (si algo falla: AppError → Error Middleware → Respuesta)
```

## DTO vs Model

El **Model** (`Incident`) es cómo existe el incidente dentro de mi aplicación: tiene todos los campos, incluidos los que solo el servidor debe controlar (`id`, `status`, `createdAt`). El **DTO** (`CreateIncidentDto`) es lo que le permito enviar al cliente en una operación concreta: solo título, descripción, reportante, ubicación, prioridad y minutos. Así el cliente no puede inventar un `id` ni marcar un incidente como `RESOLVED` desde el POST. En el controller recibo el DTO y construyo el Model agregando `id`, `status: "OPEN"` y `createdAt`. Uso DTOs distintos para crear (`CreateIncidentDto`), actualizar (`UpdateIncidentDto`, sin `reporter`) y cambiar estado (`UpdateIncidentStatusDto`).

## Decisiones técnicas

**Reto 4 (CRITICAL ≤ 60 minutos) → implementado en `validateTime`.** La regla trata sobre el tiempo estimado, y `validatePriority` ya corrió antes, por lo que en ese punto la prioridad está garantizada como válida y solo hay que compararla con los minutos. Así `validateIncident` se queda con "¿existen los campos?", `validatePriority` con "¿es válida la prioridad?" y `validateTime` con todo lo relacionado a minutos.

**Reto 5 (transiciones de estado) → en el controller**, con la tabla `STATUS_TRANSITIONS` del modelo. Depende del estado *actual* del incidente guardado en los datos, que un middleware de validación de body no conoce. El controller lanza `AppError(400)`.

**Auth solo en escrituras.** Los GET son públicos (como en el ejemplo de cURL del enunciado) y POST/PUT/PATCH/DELETE exigen token.

**Rutas `/critical`, `/pending`, `/stats` antes de `/:id`** para que Express no las confunda con un id.

## Reflexión: ¿por qué middlewares y no todo dentro del controller?

*(Reescribe esta respuesta con tus propias palabras antes de entregar.)*

Si cada controller tuviera su propia validación, autenticación y manejo de errores, repetiría el mismo código en cinco o seis lugares. Con middlewares escribo cada regla una sola vez y la reutilizo en las rutas que la necesiten, así que si mañana cambia la regla (por ejemplo el máximo de minutos) modifico un solo archivo. Además el controller queda limpio: solo contiene la lógica del negocio porque, cuando llega hasta ahí, ya sabe que el usuario está autenticado y los datos son válidos. Cada pieza tiene una sola responsabilidad, lo que hace el código más fácil de leer, probar y ampliar. Y con el manejo centralizado de errores todas las respuestas de error tienen el mismo formato y no hay `res.status(...).json(...)` repetido por todos lados.

## Pruebas

Las 20 pruebas mínimas (más 4 extra) están automatizadas en `tests/run-tests.sh`. Los resultados están en `evidencias/resultados-pruebas.md`.

## Retos adicionales implementados

Reto 1 (`/critical`), Reto 2 (`/pending`), Reto 3 (`/stats`), Reto 4 (regla CRITICAL) y Reto 5 (transiciones de estado).
