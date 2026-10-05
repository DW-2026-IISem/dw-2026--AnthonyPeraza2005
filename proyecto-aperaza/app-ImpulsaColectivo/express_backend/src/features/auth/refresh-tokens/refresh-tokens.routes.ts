import { Application } from "express";
import { RefreshTokensController } from "./refresh-tokens.controller";
import { authenticate } from "../access";

/**
 * Rutas del feature RefreshTokens — **modalidad 2 (JWT, sin RBAC)**.
 *
 * Todas operan sobre las **sesiones del usuario autenticado**. Ver y revocar las
 * propias sesiones es un derecho derivado de estar autenticado, no de un permiso
 * concreto; por eso no llevan `authorize` ni figuran en el catálogo de recursos.
 *
 * Nota de enrutado: `/api/sesiones/deactivate-all` es una ruta literal del mismo
 * verbo (`PATCH`) que `/api/sesiones/:id/deactivate`. No colisionan (distinto
 * número de segmentos), pero la literal se registra primero por claridad.
 */
export class RefreshTokensRoutes {
  private readonly controller = new RefreshTokensController();

  public routes(app: Application): void {
    // getAll (sesiones propias)
    app.route("/api/sesiones").get(authenticate, this.controller.getAll.bind(this.controller));

    // revocar todas las sesiones propias (ruta literal: va ANTES de /:id)
    app
      .route("/api/sesiones/deactivate-all")
      .patch(authenticate, this.controller.revokeAll.bind(this.controller));

    // getOne
    app.route("/api/sesiones/:id").get(authenticate, this.controller.getOne.bind(this.controller));

    // revocar una sesión propia
    app
      .route("/api/sesiones/:id/deactivate")
      .patch(authenticate, this.controller.revokeOne.bind(this.controller));

    // purga de sesiones propias revocadas/expiradas
    app.route("/api/sesiones").delete(authenticate, this.controller.purge.bind(this.controller));
  }
}
