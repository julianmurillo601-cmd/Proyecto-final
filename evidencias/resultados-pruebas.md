

Ejecutadas con `npm run test:api` (cURL) el 2026-09-23 contra el servidor local en http://localhost:3000.


```
[OK  ] Prueba 1 - GET todos los incidentes | esperado: 200 | obtenido: 200
        respuesta: {"ok":true,"total":6,"data":[{"id":1,"title":"Proyector sin señal","description":"El proyector no reconoce ningún computador conectado.","reporter":"Carlos Díaz","location":"Aula 201","priority":"MEDIUM","status":"OPE
[OK  ] Prueba 2 - GET incidente existente (id 1) | esperado: 200 | obtenido: 200
        respuesta: {"ok":true,"data":{"id":1,"title":"Proyector sin señal","description":"El proyector no reconoce ningún computador conectado.","reporter":"Carlos Díaz","location":"Aula 201","priority":"MEDIUM","status":"OPEN","estimat
[OK  ] Prueba 3 - GET incidente inexistente (id 999) | esperado: 404 | obtenido: 404
        respuesta: {"ok":false,"message":"Incident not found"}
[OK  ] Prueba 4 - GET con ID abc | esperado: 400 | obtenido: 400
        respuesta: {"ok":false,"message":"Invalid incident id"}
[OK  ] Prueba 5 - POST válido | esperado: 201 | obtenido: 201
        respuesta: {"ok":true,"message":"Incident created","data":{"id":7,"title":"Router sin conectividad","description":"El router del segundo piso perdió conexión.","reporter":"Ana Torres","location":"Piso 2","priority":"HIGH","status
        (id del incidente creado: 7)
[OK  ] Prueba 6 - POST sin título | esperado: 400 | obtenido: 400
        respuesta: {"ok":false,"message":"title is required and must be a non-empty string"}
[OK  ] Prueba 7 - POST prioridad inválida | esperado: 400 | obtenido: 400
        respuesta: {"ok":false,"message":"Invalid priority. Allowed values: LOW, MEDIUM, HIGH, CRITICAL"}
[OK  ] Prueba 8 - POST estimatedMinutes negativo | esperado: 400 | obtenido: 400
        respuesta: {"ok":false,"message":"estimatedMinutes must be greater than 0"}
[OK  ] Prueba 9 - POST CRITICAL con 180 min | esperado: 400 | obtenido: 400
        respuesta: {"ok":false,"message":"CRITICAL incidents cannot exceed 60 estimated minutes"}
[OK  ] Prueba 10 - PUT existente | esperado: 200 | obtenido: 200
        respuesta: {"ok":true,"message":"Incident updated","data":{"id":7,"title":"Pantalla sin imagen","description":"El monitor dejó de mostrar imagen.","reporter":"Ana Torres","location":"Oficina 407","priority":"HIGH","status":"OPEN",
[OK  ] Prueba 11 - PUT inexistente | esperado: 404 | obtenido: 404
        respuesta: {"ok":false,"message":"Incident not found"}
[OK  ] Prueba 12 - PATCH OPEN -> IN_PROGRESS | esperado: 200 | obtenido: 200
        respuesta: {"ok":true,"message":"Incident status updated","data":{"id":7,"title":"Pantalla sin imagen","description":"El monitor dejó de mostrar imagen.","reporter":"Ana Torres","location":"Oficina 407","priority":"HIGH","status":
[OK  ] Prueba 13 - PATCH IN_PROGRESS -> RESOLVED | esperado: 200 | obtenido: 200
        respuesta: {"ok":true,"message":"Incident status updated","data":{"id":7,"title":"Pantalla sin imagen","description":"El monitor dejó de mostrar imagen.","reporter":"Ana Torres","location":"Oficina 407","priority":"HIGH","status":
[OK  ] Prueba 14 - PATCH RESOLVED -> OPEN | esperado: 400 | obtenido: 400
        respuesta: {"ok":false,"message":"Invalid status transition: RESOLVED -> OPEN"}
[OK  ] Prueba 15 - DELETE sin token | esperado: 401 | obtenido: 401
        respuesta: {"ok":false,"message":"Authentication required"}
[OK  ] Prueba 16 - DELETE con technician-token | esperado: 403 | obtenido: 403
        respuesta: {"ok":false,"message":"Administrator permissions required"}
[OK  ] Prueba 17 - DELETE con instructor-token | esperado: 204 | obtenido: 204
        respuesta: 
[OK  ] Prueba 18 - Ruta inexistente (GET /api/planets) | esperado: 404 | obtenido: 404
        respuesta: {"ok":false,"message":"Route not found"}
[OK  ] Prueba 19 - GET /critical | esperado: 200 | obtenido: 200
        respuesta: {"ok":true,"total":2,"data":[{"id":2,"title":"Servidor de archivos sin respuesta","description":"Nadie puede acceder a las carpetas compartidas del área administrativa.","reporter":"Sandra Ruiz","location":"Sala de serv
[OK  ] Prueba 20 - GET /stats | esperado: 200 | obtenido: 200
        respuesta: {"ok":true,"data":{"total":6,"open":3,"inProgress":2,"resolved":1,"critical":2,"averageEstimatedMinutes":48}}
--- Pruebas extra ---
[OK  ] Prueba 21 - GET /pending | esperado: 200 | obtenido: 200
        respuesta: {"ok":true,"total":5,"data":[{"id":1,"title":"Proyector sin señal","description":"El proyector no reconoce ningún computador conectado.","reporter":"Carlos Díaz","location":"Aula 201","priority":"MEDIUM","status":"OPE
[OK  ] Prueba 22 - PATCH con estado inválido | esperado: 400 | obtenido: 400
        respuesta: {"ok":false,"message":"Invalid status. Allowed values: OPEN, IN_PROGRESS, RESOLVED"}
[OK  ] Prueba 23 - POST con token incorrecto | esperado: 401 | obtenido: 401
        respuesta: {"ok":false,"message":"Invalid token"}
[OK  ] Prueba 24 - POST con JSON mal formado | esperado: 400 | obtenido: 400
        respuesta: {"ok":false,"message":"Malformed JSON body"}

RESUMEN: 24 correctas, 0 fallidas de 24 pruebas
```

```
IncidentHub API running on http://localhost:3000
[2026-09-23T17:59:13.111Z] GET /api/incidents
[2026-09-23T17:59:13.125Z] GET /api/incidents/1
[2026-09-23T17:59:13.134Z] GET /api/incidents/999
[2026-09-23T17:59:13.142Z] GET /api/incidents/abc
[2026-09-23T17:59:13.150Z] POST /api/incidents
[2026-09-23T17:59:13.173Z] POST /api/incidents
[2026-09-23T17:59:13.182Z] POST /api/incidents
[2026-09-23T17:59:13.193Z] POST /api/incidents
[2026-09-23T17:59:13.201Z] POST /api/incidents
[2026-09-23T17:59:13.210Z] PUT /api/incidents/7
[2026-09-23T17:59:13.219Z] PUT /api/incidents/999
[2026-09-23T17:59:13.226Z] PATCH /api/incidents/7/status
[2026-09-23T17:59:13.234Z] PATCH /api/incidents/7/status
[2026-09-23T17:59:13.242Z] PATCH /api/incidents/7/status
[2026-09-23T17:59:13.251Z] DELETE /api/incidents/7
[2026-09-23T17:59:13.258Z] DELETE /api/incidents/7
[2026-09-23T17:59:13.265Z] DELETE /api/incidents/7
[2026-09-23T17:59:13.272Z] GET /api/planets
[2026-09-23T17:59:13.279Z] GET /api/incidents/critical
[2026-09-23T17:59:13.286Z] GET /api/incidents/stats
[2026-09-23T17:59:13.293Z] GET /api/incidents/pending
[2026-09-23T17:59:13.300Z] PATCH /api/incidents/1/status
[2026-09-23T17:59:13.308Z] POST /api/incidents
[2026-09-23T17:59:13.315Z] POST /api/incidents
```
