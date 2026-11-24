# ISS-CR-04 · Integración, pruebas y cierre

## Flujo demostrado

1. El administrador inicia sesión y abre `admin/matriz`.
2. El front carga roles y recursos, y las concesiones del rol elegido.
3. Cambia casillas y guarda: `POST /api/concesiones-rol` con `{ role_id, resource_ids }`.
4. El backend valida el rol y los recursos y reconcilia en una transacción.
5. El front muestra la confirmación y recarga el rol.
6. Una petición directa a un recurso concedido pasa (200) y a uno no concedido recibe 403.

## Prueba de API contra el backend real

Script de integración (no se versiona: usa credenciales de prueba por variables de entorno).
Usa PROMOTER como rol de prueba y lo restaura al terminar.

Salida de la ejecución:

~~~text

== Sin sesión ==
OK    401 al guardar la matriz sin JWT
OK    401 al leer usuarios sin JWT

== Catálogo ==
OK    no hay method+path duplicados

== Antes de conceder ==
OK    403 de PROMOTER en GET /api/usuarios

== Guardar la matriz ==
OK    200 al guardar el conjunto
OK    total_active coincide
OK    las concesiones reflejan lo guardado
OK    200 de PROMOTER en GET /api/usuarios

== Entradas inválidas (no deben cambiar nada) ==
OK    400 con un recurso que no existe
OK    400 con IDs repetidos
OK    404 con un rol que no existe
OK    400 con cuerpo mixto
OK    sin cambios parciales tras los rechazos

== Protección de ADMIN ==
OK    409 al dejar a ADMIN sin acceso al panel
OK    ADMIN conserva sus permisos

== Restaurar PROMOTER ==
OK    200 al restaurar los permisos originales
OK    403 de PROMOTER otra vez en GET /api/usuarios
OK    PROMOTER quedó igual que al inicio

Resultado: TODO OK
~~~

## Seeder

- `npm run db:seed` reconcilia ADMIN, PROMOTER y CONTRIBUTOR a sus permisos por defecto, por lo que sobrescribe lo editado en la matriz. Solo debe usarse en una base descartable.
- `npm run db:sync-catalog` sincroniza únicamente `resources`. Se repitió la prueba de integración después de ejecutarlo y las concesiones no cambiaron.

## Pruebas y compilación

| Comprobación | Resultado |
| --- | --- |
| Backend `tsc --noEmit` | Sin errores |
| Frontend `npm test` | 62 archivos, 427 pruebas pasando |
| Frontend `ng build` | Sin errores |

## Criterios de aceptación

| Criterio | Cumplido | Dónde se comprueba |
| --- | --- | --- |
| Contrato documentado y coherente con el backend | Sí | ISS-CR-00 y ISS-CR-02 |
| Catálogo único y sincronizado | Sí | `db:sync-catalog`; prueba de duplicados |
| Rutas protegidas por JWT y RBAC | Sí | 401 sin JWT; 403 sin concesión |
| Reconciliación transaccional con validación de IDs | Sí | 400 y 404 sin cambios parciales |
| Matriz con estados marcado, desmarcado y parcial | Sí | `permission-matrix.spec.ts` y pantalla |
| El front muestra errores y confirma éxito solo con respuesta del API | Sí | `permission-matrix-page.spec.ts` |
| Autorización comprobada con petición directa | Sí | Script de integración |
| Pruebas unitarias y compilaciones pasan | Sí | Tabla anterior |
| Seeder probado y efectos documentados | Sí | Sección Seeder |
| Evidencia sin secretos | Sí | Sin tokens ni contraseñas en el repo |

## Reflexión

**¿Por qué el backend es la autoridad final de permisos?**
La pantalla solo oculta o deshabilita controles, y cualquiera puede llamar al API sin pasar por ella. El middleware `authorize` evalúa en cada petición el usuario, sus roles activos y las concesiones activas sobre el recurso (método y ruta). Por eso la prueba directa devuelve 403 aunque la interfaz mostrara el botón.

**¿Qué simplifica reconciliar una lista completa en una transacción?**
El front manda el estado deseado y el backend calcula las altas, reactivaciones y retiros. No hay que coordinar muchas llamadas sueltas ni arreglar un rol a medias si una falla: o se aplica todo o no cambia nada. Además, repetir el guardado es seguro.
