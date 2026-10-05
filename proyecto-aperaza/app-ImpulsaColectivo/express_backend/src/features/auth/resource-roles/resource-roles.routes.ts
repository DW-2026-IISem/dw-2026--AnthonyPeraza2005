import { Application } from "express";
import { ResourceRolesController } from "./resource-roles.controller";

/**
 * Rutas del feature ResourceRoles: vía administrativa para conceder un recurso
 * a un rol (crear un permiso): `POST /api/concesiones-rol` con
 * `{ role_id, resource_id }`.
 *
 * El efecto es inmediato y por datos: la siguiente petición del usuario afectado
 * ya consulta la nueva matriz, sin reiniciar ni desplegar.
 *
 * TEMPORAL: SIN AUTH. En ISS-21 pasan a JWT + RBAC.
 */
export class ResourceRolesRoutes {
  private readonly controller = new ResourceRolesController();

  public routes(app: Application): void {
    app.route("/api/concesiones-rol").get(this.controller.getAll.bind(this.controller));
    app.route("/api/concesiones-rol/:id").get(this.controller.getOne.bind(this.controller));
    app.route("/api/concesiones-rol").post(this.controller.grant.bind(this.controller));
    app
      .route("/api/concesiones-rol/:id/deactivate")
      .patch(this.controller.deactivate.bind(this.controller));
    app
      .route("/api/concesiones-rol/:id/reactivate")
      .patch(this.controller.reactivate.bind(this.controller));
  }
}
