# ISS-CR-03 · Pantalla de matriz de permisos (frontend)

## Qué se construyó

- `admin/matriz`: pantalla para elegir un rol y marcar qué puede hacer sobre cada entidad.
- Cinco columnas: Crear, Leer, Actualizar, Estado y Eliminar. Una casilla agrupa varios recursos HTTP; si el rol tiene solo algunos, se muestra en estado parcial.
- Guardar envía el conjunto completo a `POST /api/concesiones-rol` con `{ role_id, resource_ids }`.
- Lógica pura en `permission-matrix.ts`, probada aparte de la pantalla.
- Ruta protegida con `GET /api/concesiones-rol` y opción «Matriz» en el menú.

## Decisiones

- Las concesiones activas sobre recursos inactivos se ignoran al cargar, para que el guardado no falle con 400.
- Cambiar un rol propio pide confirmación y avisa que hay que pulsar «Actualizar permisos» en el perfil.
- Quitar todos los permisos de un rol pide confirmación.
- Una respuesta de un rol anterior se descarta si el usuario ya cambió de rol.
- Sin permiso `POST /api/concesiones-rol`, las casillas quedan deshabilitadas y no aparece Guardar.

## Verificación

| Comprobación | Resultado |
| --- | --- |
| `npm test` | 62 archivos, 427 pruebas, todas pasando |
| `ng build` | Sin errores |
| Recorrido en el navegador (admin y promoter) | Completado: admin y promoter, estados y guardado correctos |

## Pendiente

- Pruebas de integración y criterios de cierre en CR-04.
