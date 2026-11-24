# ISS-CR-00 · Contrato y decisiones de la matriz de permisos (ImpulsaColectivo)

El panel edita concesiones **rol-recurso** (`resource_roles`). No asigna roles a
personas (eso es `role_users`) ni reemplaza el middleware `authorize`.

## Recorrido de una casilla

```text
resource-catalog.ts -> seeder -> GET /api/recursos
  -> pantalla matriz (Crear / Leer / Actualizar / Estado / Eliminar)
  -> POST /api/concesiones-rol { role_id, resource_ids }
  -> ResourceRolesController -> ResourceRolesService.reconcileRole (transacción)
  -> resource_roles (status active / inactive)
  -> authorize.middleware: findEffectiveForUser en cada petición
```

Cadena de autorización: usuario activo -> role_users activo -> rol activo ->
resource_roles activo -> recurso activo. Un eslabón inactivo = 403 (deny by default).

## Contrato

| Acción | Método y ruta | Respuesta | Estado |
| :-- | :-- | :-- | :-- |
| Listar roles | GET /api/roles | { roles } | existe |
| Listar recursos | GET /api/recursos | { resources } | existe |
| Concesiones de un rol | GET /api/concesiones-rol?role_id=<id> | { grants } (solo activas) | existe |
| Conceder una | POST /api/concesiones-rol { role_id, resource_id } | 201 { message, grant } | existe |
| Guardar matriz completa | POST /api/concesiones-rol { role_id, resource_ids } | 200 { message, result } | NUEVO (CR-02) |
| Permisos efectivos | GET /api/permisos | { permissions } | existe |

`result` = { role_id, activated, deactivated, total_active }.
La rama de matriz se activa cuando el cuerpo trae `resource_ids`.

## Columnas de la matriz

| Columna | Recursos que agrupa |
| :-- | :-- |
| Crear | POST /api/<entidad> |
| Leer | GET /api/<entidad> y GET /api/<entidad>/:id |
| Actualizar | PUT y PATCH /api/<entidad>/:id |
| Estado | PATCH /api/<entidad>/:id/deactivate y .../reactivate (baja lógica) |
| Eliminar | DELETE /api/<entidad>/:id |

## Decisiones

1. **Cinco columnas.** La baja (`/deactivate`) va aparte de Actualizar: dar permiso de editar no debe dar permiso de dar de baja. Coincide con los botones del front.
2. **Rutas con otro sufijo** (ej. GET /api/usuarios/:id/permisos, cambio de contraseña): se clasifican por método (GET Leer, POST Crear, PUT/PATCH Actualizar, DELETE Eliminar) y se listan en el tooltip de la casilla. Se confirma con el catálogo real en CR-01.
3. **Una casilla puede agrupar varios recursos.** Estado parcial cuando solo algunos están concedidos.
4. **Pantalla nueva** `admin/matriz` (ver: GET /api/concesiones-rol; guardar: POST /api/concesiones-rol). La pantalla Permisos queda como vista por registro; no se reemplaza.
5. Solo roles activos y recursos activos aparecen en la matriz.
6. **Lista vacía = el rol queda sin permisos** (deliberado). La interfaz pide confirmación.
7. **Protección de ADMIN:** el backend rechaza (409) una matriz para ADMIN que lo deje sin los recursos de administración de concesiones. La interfaz avisa al editar un rol propio.
8. `reconcileRole` ya existe y lo usa el seeder: CR-02 lo expone por HTTP con validación; no se duplica.
9. Los errores de validación devuelven 400 (datos), 404 (rol inexistente o inactivo) y 409 (protección de ADMIN).

## Riesgos conocidos

- `npm run db:seed` ejecuta `seedResourceRoles`, que reconcilia ADMIN, PROMOTER y CONTRIBUTOR a sus valores por defecto: **pisa lo guardado desde la matriz**. No ejecutarlo después de configurar permisos a mano. AUDITOR no se toca. CR-01 revisa si conviene un modo de sincronizar solo el catálogo.
- Marcar todo en un rol entrega permisos de baja y eliminación: revisar antes de guardar.
- Ocultar un botón en Angular es solo UX: la autoridad es `authorize` en el backend.

## Preguntas de diseño (respuestas)

1. **¿Por qué ocultar un botón no protege un endpoint?** Cualquiera puede llamar la API con curl o Postman. `authorize` consulta `findEffectiveForUser` en cada petición.
2. **Recurso activo con concesión revocada:** `findEffectiveForUser` exige `resource_roles.status = active`; sin la fila no hay coincidencia y responde 403.
3. **`PATCH /api/x/:id/deactivate` vs `PATCH /api/x/:id`:** `pathMatches` exige igual número de segmentos y segmentos literales iguales; son recursos distintos y se conceden por separado.
4. **Concesión que ya existe y se vuelve a marcar:** el POST individual da 409 si está activa y reactiva si estaba inactiva; la reconciliación es idempotente y no cambia nada.
5. **Error de validación para el front:** `AppError(400, mensaje)` por `sendError`; el front lo muestra con `toApiMessage`.

## Criterios de aceptación de CR-00

- [x] Flujo frontend -> API -> persistencia sin saltarse capas (recorrido arriba).
- [x] `role_id` (rol) distinto de `resource_id` (operación method + path).
- [x] El servidor autoriza cada petición.
- [x] Contrato de consulta y guardado acordado antes de implementar.
- [x] "Actualizar" = PUT y PATCH; Estado y Eliminar separados.
- [x] Endpoints especiales documentados (decisión 2).
- [x] Archivos a extender: backend `features/auth/resource-roles/*`; frontend `features/admin/*` y `ResourceRoleApi`.
