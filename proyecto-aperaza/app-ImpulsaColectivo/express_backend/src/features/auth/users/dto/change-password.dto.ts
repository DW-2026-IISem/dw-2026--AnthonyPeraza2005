/**
 * Datos de entrada de `PATCH /api/usuarios/:id/password`.
 *
 * Exige la contraseña ACTUAL además de la nueva: nadie puede cambiar la
 * credencial de otro usuario sin conocerla (defensa en profundidad).
 */
export interface ChangePasswordDto {
  current_password: string;
  new_password: string;
}
