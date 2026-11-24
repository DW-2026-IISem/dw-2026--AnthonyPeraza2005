/**
 * Datos de entrada de `POST /api/concesiones-rol`: conceder un recurso a un rol.
 *
 * Esta operación CREA UN PERMISO: el permiso no es una entidad con nombre, es la
 * tupla `(role_id, resource_id)` materializada en `resource_roles`. Si la
 * concesión ya existía inactiva, se reactiva en lugar de duplicarla.
 *
 * Ejemplo: conceder `POST /api/contribuciones` al rol `CONTRIBUTOR` significa
 * que sus usuarios podrán registrar aportes, sin tocar el código.
 */
export interface CreateResourceRoleDto {
  role_id: number;
  resource_id: number;
}

/**
 * Datos de entrada de `POST /api/concesiones-rol` cuando trae `resource_ids`:
 * guarda la matriz completa de un rol.
 *
 * Es el estado FINAL deseado, no una operación por casilla: el service calcula las
 * diferencias y las aplica en una transacción. Una lista vacía deja al rol sin
 * permisos. La respuesta (`ReconcileResult`) la define el service.
 */
export interface ReconcileResourceRolesDto {
  role_id: number;
  resource_ids: number[];
}
