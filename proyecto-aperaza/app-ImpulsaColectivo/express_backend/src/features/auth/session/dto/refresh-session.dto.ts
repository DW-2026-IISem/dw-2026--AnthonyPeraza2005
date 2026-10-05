/**
 * Datos de entrada de `POST /api/sesion/refresh` (modalidad OPEN con credencial
 * de sesión).
 *
 * El refresh token viaja en el **cuerpo**, no en la cabecera `Authorization`:
 * es una credencial de sesión, no un token de acceso.
 */
export interface RefreshSessionDto {
  refresh_token: string;
}
