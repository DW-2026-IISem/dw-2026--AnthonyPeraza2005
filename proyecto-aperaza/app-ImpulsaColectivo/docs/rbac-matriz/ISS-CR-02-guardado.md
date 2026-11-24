# ISS-CR-02 · Guardado de la matriz en el backend (resultados)

## Contrato

`POST /api/concesiones-rol` con `{ role_id, resource_ids: [...] }` deja al rol con
**exactamente** ese conjunto de permisos. La rama se activa cuando el cuerpo trae
`resource_ids`; con `resource_id` sigue funcionando la concesión individual.

Respuesta 200: `{ message: "Role permissions updated", result: { role_id, activated, deactivated, total_active } }`.
Errores: `{ "error": "<mensaje>" }`.

## Qué se cambió (todo en `express_backend/src/features/auth/`)

| Archivo | Cambio |
| :-- | :-- |
| `resource-roles/dto/create-resource-role.dto.ts` | `ReconcileResourceRolesDto` |
| `resources/resources.repository.ts` | `findByIds(ids)` |
| `resource-roles/resource-roles.service.ts` | `saveRoleMatrix` (valida y llama a `reconcileRole`) y `assertAdminKeepsPanelAccess` |
| `resource-roles/resource-roles.controller.ts` | rama `resource_ids` en `grant` y `validateReconcileBody` |
| `resource-roles/resource-roles.swagger.ts` | cuerpo `oneOf`, respuesta 200 y esquema `ResourceRoleReconcile` |

`reconcileRole` no se tocó: el seeder lo sigue usando igual que antes. La ruta y sus middlewares (`authenticate`, `authorize`) tampoco cambiaron.

## Reglas

| Caso | Código |
| :-- | :-- |
| Cuerpo mixto (`resource_id` y `resource_ids`) | 400 |
| `role_id` no es un entero positivo | 400 |
| `resource_ids` no es un arreglo de enteros positivos | 400 |
| `resource_ids` con repetidos | 400 |
| Algún recurso no existe o está inactivo | 400 (lista los ids) |
| Rol inexistente o inactivo | 404 |
| Matriz de ADMIN sin las 4 operaciones del panel | 409 |
| Sin token / sin permiso | 401 / 403 |
| Lista vacía | 200: el rol queda sin permisos |

Operaciones que ADMIN debe conservar: GET /api/roles, GET /api/recursos, GET /api/concesiones-rol, POST /api/concesiones-rol.
La validación del service ocurre antes de la transacción de `reconcileRole`.

## Verificación con curl (rol desechable PRUEBA_MATRIZ, id 5)

| # | Caso | Resultado |
| :-- | :-- | :-- |
| 1 | Alta de 3 permisos | 200, activated 3, total_active 3 |
| 2 | Repetir el mismo conjunto | 200, activated 0, deactivated 0 |
| 3 | Dejar solo uno | 200, deactivated 2, total_active 1 |
| 4 | Concesiones activas del rol | 1 |
| 5 | Reactivar uno retirado | 200, activated 1, total_active 2 |
| 6 | Lista vacía | 200, deactivated 2, total_active 0 |
| 7 | Ids repetidos | 400 |
| 8 | Recurso inexistente | 400 |
| 9 | Rol inexistente | 404 |
| 10 | resource_id y resource_ids | 400 |
| 11 | role_id no numérico | 400 |
| 12 | Sin token | 401 |
| 13 | CONTRIBUTOR sin permiso | 403 |
| 14 | ADMIN sin acceso al panel | 409 |
| 15 | ADMIN sigue intacto | 110 permisos |
| 16 | Baja del rol de prueba | 200 |
| 17 | Guardar en rol inactivo | 404 |

## Notas

- El backend no tiene corredor de pruebas; la verificación se hizo con curl sobre un rol desechable, nunca sobre ADMIN, PROMOTER ni CONTRIBUTOR.
- `PRUEBA_MATRIZ` quedó inactivo en la base (baja lógica).
- Pendiente: `resource-roles.http` conserva un token JWT pegado (ya vencido); conviene quitarlo.
- Pendiente (de CR-01): POST /api/promotores con cuerpo vacío responde 500 en lugar de 400.

## Criterios de aceptación de CR-02

- [x] La reconciliación es idempotente y transaccional.
- [x] Las entradas inválidas no dejan cambios parciales.
- [x] La respuesta informa cambios y total activo.
- [x] La ruta exige JWT y permiso RBAC.
- [x] Se cubren alta, revocación, duplicados, rol inválido y rol inactivo (por curl; el rollback transaccional lo garantiza `withTransaction`).
- [x] Se probó con datos descartables, no con el único administrador real.
