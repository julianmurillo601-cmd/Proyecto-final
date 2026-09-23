#!/usr/bin/env bash
# Pruebas mínimas obligatorias de IncidentHub API (requiere el servidor corriendo).
# Uso: npm run dev (en otra terminal)  y luego  npm run test:api
BASE="${BASE:-http://localhost:3000}"
TECH="Authorization: Bearer technician-token"
ADMIN="Authorization: Bearer instructor-token"
PASS=0; FAIL=0
BODY_FILE="$(mktemp)"

# uso: run "descripción" esperado curl-args...
run() {
  local desc="$1" expected="$2"; shift 2
  local code
  code=$(curl -s -o "$BODY_FILE" -w "%{http_code}" "$@")
  N=$((N+1))
  if [ "$code" = "$expected" ]; then PASS=$((PASS+1)); mark="OK  "; else FAIL=$((FAIL+1)); mark="FAIL"; fi
  echo "[$mark] Prueba $N - $desc | esperado: $expected | obtenido: $code"
  echo "        respuesta: $(head -c 220 "$BODY_FILE")"
}
N=0

run "GET todos los incidentes"            200 "$BASE/api/incidents"
run "GET incidente existente (id 1)"      200 "$BASE/api/incidents/1"
run "GET incidente inexistente (id 999)"  404 "$BASE/api/incidents/999"
run "GET con ID abc"                      400 "$BASE/api/incidents/abc"

run "POST válido"                         201 -X POST "$BASE/api/incidents" -H "Content-Type: application/json" -H "$TECH" \
  -d '{"title":"Router sin conectividad","description":"El router del segundo piso perdió conexión.","reporter":"Ana Torres","location":"Piso 2","priority":"HIGH","estimatedMinutes":40}'
NEW_ID=$(sed -n 's/.*"id":\([0-9]*\).*/\1/p' "$BODY_FILE" | head -1)
echo "        (id del incidente creado: $NEW_ID)"

run "POST sin título"                     400 -X POST "$BASE/api/incidents" -H "Content-Type: application/json" -H "$TECH" \
  -d '{"description":"x","reporter":"Ana","location":"Piso 2","priority":"HIGH","estimatedMinutes":40}'
run "POST prioridad inválida"             400 -X POST "$BASE/api/incidents" -H "Content-Type: application/json" -H "$TECH" \
  -d '{"title":"t","description":"d","reporter":"Ana","location":"Piso 2","priority":"SUPER_IMPORTANT","estimatedMinutes":40}'
run "POST estimatedMinutes negativo"      400 -X POST "$BASE/api/incidents" -H "Content-Type: application/json" -H "$TECH" \
  -d '{"title":"t","description":"d","reporter":"Ana","location":"Piso 2","priority":"HIGH","estimatedMinutes":-10}'
run "POST CRITICAL con 180 min"           400 -X POST "$BASE/api/incidents" -H "Content-Type: application/json" -H "$TECH" \
  -d '{"title":"t","description":"d","reporter":"Ana","location":"Piso 2","priority":"CRITICAL","estimatedMinutes":180}'

run "PUT existente"                       200 -X PUT "$BASE/api/incidents/$NEW_ID" -H "Content-Type: application/json" -H "$TECH" \
  -d '{"title":"Pantalla sin imagen","description":"El monitor dejó de mostrar imagen.","location":"Oficina 407","priority":"HIGH","estimatedMinutes":60}'
run "PUT inexistente"                     404 -X PUT "$BASE/api/incidents/999" -H "Content-Type: application/json" -H "$TECH" \
  -d '{"title":"Pantalla sin imagen","description":"El monitor dejó de mostrar imagen.","location":"Oficina 407","priority":"HIGH","estimatedMinutes":60}'

run "PATCH OPEN -> IN_PROGRESS"           200 -X PATCH "$BASE/api/incidents/$NEW_ID/status" -H "Content-Type: application/json" -H "$TECH" -d '{"status":"IN_PROGRESS"}'
run "PATCH IN_PROGRESS -> RESOLVED"       200 -X PATCH "$BASE/api/incidents/$NEW_ID/status" -H "Content-Type: application/json" -H "$TECH" -d '{"status":"RESOLVED"}'
run "PATCH RESOLVED -> OPEN"              400 -X PATCH "$BASE/api/incidents/$NEW_ID/status" -H "Content-Type: application/json" -H "$TECH" -d '{"status":"OPEN"}'

run "DELETE sin token"                    401 -X DELETE "$BASE/api/incidents/$NEW_ID"
run "DELETE con technician-token"         403 -X DELETE "$BASE/api/incidents/$NEW_ID" -H "$TECH"
run "DELETE con instructor-token"         204 -X DELETE "$BASE/api/incidents/$NEW_ID" -H "$ADMIN"

run "Ruta inexistente (GET /api/planets)" 404 "$BASE/api/planets"
run "GET /critical"                       200 "$BASE/api/incidents/critical"
run "GET /stats"                          200 "$BASE/api/incidents/stats"

echo "--- Pruebas extra ---"
run "GET /pending"                        200 "$BASE/api/incidents/pending"
run "PATCH con estado inválido"           400 -X PATCH "$BASE/api/incidents/1/status" -H "Content-Type: application/json" -H "$TECH" -d '{"status":"DONE"}'
run "POST con token incorrecto"           401 -X POST "$BASE/api/incidents" -H "Content-Type: application/json" -H "Authorization: Bearer hacker" -d '{}'
run "POST con JSON mal formado"           400 -X POST "$BASE/api/incidents" -H "Content-Type: application/json" -H "$TECH" -d '{"title": '

echo
echo "RESUMEN: $PASS correctas, $FAIL fallidas de $N pruebas"
rm -f "$BODY_FILE"
[ "$FAIL" -eq 0 ]
