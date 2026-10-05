/**
 * Datos de entrada de `POST /api/asignaciones-rol`: asignar un rol a un usuario.
 *
 * Es el primer eslabón de la autorización. Si la asignación ya existía
 * inactiva, se reactiva en lugar de duplicarla (la restricción única
 * `(user_id, role_id)` lo garantiza).
 */
export interface CreateRoleUserDto {
  user_id: number;
  role_id: number;
}
