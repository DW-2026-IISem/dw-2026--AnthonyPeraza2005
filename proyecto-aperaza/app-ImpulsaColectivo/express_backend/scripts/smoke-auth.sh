#!/usr/bin/env bash
# Smoke test E2E de las tres modalidades de acceso de ImpulsaColectivo.
# Requisitos: API corriendo y BD sembrada (npm run db:seed).
#   uso:  bash scripts/smoke-auth.sh        (BASE_URL opcional)
B="${BASE_URL:-http://localhost:4000}"
J='Content-Type: application/json'
PASS=0; FAIL=0

field()  { node -pe "JSON.parse(require('fs').readFileSync(0)).$1"; }
status() { curl -s -o /dev/null -w "%{http_code}" "$@"; }
login()  { curl -s -X POST "$B/api/sesion/login" -H "$J" -d "{\"identifier\":\"$1\",\"password\":\"$2\"}"; }
check()  {
  if [ "$2" = "$3" ]; then PASS=$((PASS+1)); echo "  ✔ $1 ($3)"
  else FAIL=$((FAIL+1)); echo "  ✘ $1 (esperado $2, obtenido $3)"; fi
}
get() { status -H "Authorization: Bearer $1" "$B$2"; }

echo "== Preparación: tres logins reales"
A=$(login admin 'Admin123!');             ADMIN=$(echo "$A" | field access_token);   RA=$(echo "$A" | field refresh_token)
P=$(login promoter 'Promoter123!');       PROM=$(echo "$P" | field access_token)
C=$(login contributor 'Contributor123!'); CONTRIB=$(echo "$C" | field access_token); RC=$(echo "$C" | field refresh_token)
[ -n "$ADMIN" ] && [ -n "$PROM" ] && [ -n "$CONTRIB" ] || { echo "No se pudo iniciar sesión: ¿API arriba y seed ejecutado?"; exit 1; }

echo "== OPEN"
check "login contraseña errónea"        401 "$(status -X POST $B/api/sesion/login -H "$J" -d '{"identifier":"admin","password":"mala"}')"
check "login usuario inexistente"       401 "$(status -X POST $B/api/sesion/login -H "$J" -d '{"identifier":"nadie","password":"x"}')"
check "login sin cuerpo"                400 "$(status -X POST $B/api/sesion/login)"
check "login por correo"                200 "$(status -X POST $B/api/sesion/login -H "$J" -d '{"identifier":"promoter@impulsacolectivo.local","password":"Promoter123!"}')"
check "Swagger JSON sin token"          200 "$(status $B/api/docs.json)"

echo "== JWT"
check "perfil sin token"                401 "$(status $B/api/sesion/perfil)"
check "perfil token manipulado"         401 "$(get no.es.un.jwt /api/sesion/perfil)"
check "perfil con token"                200 "$(get $ADMIN /api/sesion/perfil)"
check "permisos admin = 110"            110 "$(curl -s -H "Authorization: Bearer $ADMIN"   $B/api/permisos | field 'permissions.length')"
check "permisos promoter = 23"          23  "$(curl -s -H "Authorization: Bearer $PROM"    $B/api/permisos | field 'permissions.length')"
check "permisos contributor = 15"       15  "$(curl -s -H "Authorization: Bearer $CONTRIB" $B/api/permisos | field 'permissions.length')"
check "sesiones propias (sin RBAC)"     200 "$(get $CONTRIB /api/sesiones)"

echo "== JWT + RBAC: sin token, 16 colecciones"
for p in promotores contribuyentes proyectos metas recompensas contribuciones transacciones-pago comisiones \
         desembolsos reembolsos auditorias-proyecto usuarios roles recursos asignaciones-rol concesiones-rol; do
  check "GET /api/$p sin token" 401 "$(status $B/api/$p)"
done

echo "== JWT + RBAC: ADMIN lee las 16 colecciones"
for p in promotores contribuyentes proyectos metas recompensas contribuciones transacciones-pago comisiones \
         desembolsos reembolsos auditorias-proyecto usuarios roles recursos asignaciones-rol concesiones-rol; do
  check "admin GET /api/$p" 200 "$(get $ADMIN /api/$p)"
done

echo "== JWT + RBAC: matriz de PROMOTER y CONTRIBUTOR"
check "promoter GET proyectos"          200 "$(get $PROM /api/proyectos)"
check "promoter GET desembolsos"        200 "$(get $PROM /api/desembolsos)"
check "promoter GET comisiones"         403 "$(get $PROM /api/comisiones)"
check "promoter GET reembolsos"         403 "$(get $PROM /api/reembolsos)"
check "promoter GET usuarios"           403 "$(get $PROM /api/usuarios)"
check "promoter DELETE proyecto"        403 "$(status -X DELETE -H "Authorization: Bearer $PROM" $B/api/proyectos/1)"
check "contributor GET proyectos"       200 "$(get $CONTRIB /api/proyectos)"
check "contributor GET reembolsos"      200 "$(get $CONTRIB /api/reembolsos)"
check "contributor GET promotores"      403 "$(get $CONTRIB /api/promotores)"
check "contributor GET comisiones"      403 "$(get $CONTRIB /api/comisiones)"
check "contributor POST proyectos"      403 "$(status -X POST -H "Authorization: Bearer $CONTRIB" -H "$J" -d '{}' $B/api/proyectos)"
check "contributor GET roles"           403 "$(get $CONTRIB /api/roles)"
check "admin id inválido (pasa authorize)" 400 "$(get $ADMIN /api/proyectos/abc)"

echo "== Rotación y detección de reuso"
R=$(curl -s -X POST $B/api/sesion/refresh -H "$J" -d "{\"refresh_token\":\"$RA\"}")
RA2=$(echo "$R" | field refresh_token)
check "refresh devuelve token rotado"   true "$([ -n "$RA2" ] && [ "$RA2" != "$RA" ] && echo true || echo false)"
check "reusar el token viejo"           401 "$(status -X POST $B/api/sesion/refresh -H "$J" -d "{\"refresh_token\":\"$RA\"}")"
check "el rotado cae con la familia"    401 "$(status -X POST $B/api/sesion/refresh -H "$J" -d "{\"refresh_token\":\"$RA2\"}")"

echo "== Logout idempotente"
check "logout"                          200 "$(status -X POST $B/api/sesion/logout -H "$J" -d "{\"refresh_token\":\"$RC\"}")"
check "logout repetido"                 200 "$(status -X POST $B/api/sesion/logout -H "$J" -d "{\"refresh_token\":\"$RC\"}")"
check "refresh tras logout"             401 "$(status -X POST $B/api/sesion/refresh -H "$J" -d "{\"refresh_token\":\"$RC\"}")"

echo "== Desactivar usuario: efecto inmediato (usuario1, sin rol)"
U=$(login usuario1 'Password123!'); UT=$(echo "$U" | field access_token 2>/dev/null)
if [ -n "$UT" ] && [ "$UT" != "undefined" ]; then
  check "perfil antes"                  200 "$(get $UT /api/sesion/perfil)"
  status -X PATCH -H "Authorization: Bearer $ADMIN" $B/api/usuarios/4/deactivate > /dev/null
  check "token vigente, usuario inactivo" 401 "$(get $UT /api/sesion/perfil)"
  check "login de inactivo"             401 "$(status -X POST $B/api/sesion/login -H "$J" -d '{"identifier":"usuario1","password":"Password123!"}')"
  check "restaurar usuario1"            200 "$(status -X PATCH -H "Authorization: Bearer $ADMIN" -H "$J" -d '{"status":"active"}' $B/api/usuarios/4)"
else
  echo "  (omitido: usuario1 no existe; ejecuta npm run db:seed)"
fi

echo
echo "Resultado: $PASS correctas, $FAIL fallidas"
[ "$FAIL" -eq 0 ]
