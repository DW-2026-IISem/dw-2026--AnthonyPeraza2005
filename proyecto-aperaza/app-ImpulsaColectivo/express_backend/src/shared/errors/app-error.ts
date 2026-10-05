/**
 * Error de aplicación con código HTTP explícito.
 *
 * Único tipo de error que el `service` debe lanzar para comunicar un fallo de
 * negocio (404, 400, 409...). Cualquier otro error (uno no controlado) se trata
 * como 500 en `sendError`.
 */
export class AppError extends Error {
  public readonly statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}
