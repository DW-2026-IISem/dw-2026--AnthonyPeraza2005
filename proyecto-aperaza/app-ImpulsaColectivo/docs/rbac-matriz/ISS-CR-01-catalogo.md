# ISS-CR-01 · Catálogo y operaciones del backend (resultados)

## Verificación del catálogo

- `RESOURCE_CATALOG`: 110 recursos, 110 únicos, **0 duplicados** (PROMOTER 23, CONTRIBUTOR 15).
- Composición: 11 entidades de negocio x 7 operaciones (77) + Usuarios 9 + Roles 7 + Recursos 7 + Asignaciones 5 + Concesiones 5.
- Comparación contra las rutas registradas en Express: 120 rutas reales; **0 recursos del catálogo sin ruta**.
- Las 110 rutas del catálogo usan `authenticate` y `authorize`.

## Rutas fuera del catálogo (por diseño)

| Ruta | Protección | Motivo |
| :-- | :-- | :-- |
| POST /api/sesion/login | abierta | emite los tokens; se usa sin sesión |
| POST /api/sesion/refresh | abierta + refresh token | renueva la sesión |
| POST /api/sesion/logout | abierta + refresh token | cierra la sesión (idempotente) |
| GET /api/sesion/perfil | authenticate | datos del propio usuario |
| GET /api/permisos | authenticate | permisos efectivos del propio usuario |
| GET /api/sesiones y /:id | authenticate | solo sesiones propias (ajena = 404) |
| PATCH /api/sesiones/:id/deactivate y /deactivate-all | authenticate | revoca solo sesiones propias |
| DELETE /api/sesiones | authenticate | purga solo sesiones propias inactivas o expiradas |

Las rutas `/api/sesiones*` filtran por `req.auth.id` en el service y el repository.

## Capacidades por entidad

| Grupo | Leer | Crear | Actualizar | Estado | Eliminar |
| :-- | :-- | :-- | :-- | :-- | :-- |
| 11 entidades de negocio, Roles y Recursos | listado + detalle | POST | PUT y PATCH | /deactivate | DELETE |
| Usuarios | listado + detalle + /permisos | POST | PUT, PATCH y /password | /deactivate | DELETE |
| Asignaciones y Concesiones | listado + detalle | POST | no disponible | /deactivate y /reactivate | no disponible |

En la matriz, las celdas sin rutas se muestran como "No disponible", no como casilla deshabilitada.

## Seeder y sincronización del catálogo

- `seedResources` es idempotente: `findOrCreate` por (method, path), reactiva lo inactivo y el índice único `uq_resources_method_path` impide duplicados. No toca las concesiones.
- `npm run db:seed` (completo) ejecuta además `seedResourceRoles`, que **reconcilia ADMIN, PROMOTER y CONTRIBUTOR a sus valores por defecto y pisa lo guardado desde la matriz**. AUDITOR no se toca.
- Nuevo: `npm run db:sync-catalog` ejecuta solo `seedResources`. Un recurso nuevo queda activo en el catálogo pero sin concesión para ningún rol hasta que un administrador se la dé desde la matriz.
- Política: tras configurar permisos desde la matriz, usar `db:sync-catalog`; no repetir `db:seed` completo.
- `seedResources` no desactiva recursos que se quiten del catálogo ni actualiza descripciones de los existentes.

## Riesgos

- DELETE borra físicamente registros financieros (aportes, pagos, desembolsos). Solo ADMIN lo tiene por defecto: no concederlo a otros roles aunque la matriz lo permita.
- RBAC responde "¿puede invocar esta operación?"; la validación del service responde "¿es legal con estos datos?". Ambas capas se mantienen.

## Criterios de aceptación de CR-01

- [x] Cada operación administrable tiene ruta y recurso coherentes (0 sin ruta).
- [x] Las rutas sensibles usan autenticación y autorización; las excepciones están documentadas.
- [x] El servicio conserva sus reglas de negocio.
- [x] Catálogo sin duplicados y con descripciones entendibles.
- [x] Efectos del seeder sobre concesiones personalizadas descritos.
- [x] No se probó la eliminación sobre registros reales (se usa un id inexistente).

## Verificación de acceso (curl)

Login: `POST /api/sesion/login` con `{ identifier, password }`.

| Caso | Resultado |
| :-- | :-- |
| Sin token, GET /api/usuarios | 401 |
| CONTRIBUTOR sin permiso, GET /api/usuarios | 403 |
| CONTRIBUTOR sin permiso, DELETE /api/proyectos/999999 | 403 |
| CONTRIBUTOR con permiso, GET /api/proyectos | 200 |
| ADMIN con permiso, GET /api/usuarios | 200 |
| ADMIN con permiso, POST /api/promotores con cuerpo vacío | 500 (esperado 400) |

Hallazgo: un cuerpo vacío en POST /api/promotores responde 500 en lugar de 400. No es un fallo de RBAC (la petición pasó `authorize`): el error de validación no se mapea a 400. Se revisa en CR-01.8.
