import { Application } from "express";
import { authenticate, authorize } from "../access";
import { ResourceRolesController } from "./resource-roles.controller";

/**
 * Rutas del feature ResourceRoles: vía administrativa para conceder un recurso
 * a un rol (crear un permiso): `POST /api/concesiones-rol` con
 * `{ role_id, resource_id }`.
 *
 * El efecto es inmediato y por datos: la siguiente petición del usuario afectado
 * ya consulta la nueva matriz, sin reiniciar ni desplegar.
 *
 * Modalidad 3 — JWT + RBAC: cada ruta pasa por `authenticate` y luego `authorize`.
 */
export class ResourceRolesRoutes {
  private readonly controller = new ResourceRolesController();

  public routes(app: Application): void {
    app.route("/api/concesiones-rol").get(authenticate, authorize, this.controller.getAll.bind(this.controller));
    app.route("/api/concesiones-rol/:id").get(authenticate, authorize, this.controller.getOne.bind(this.controller));
    app.route("/api/concesiones-rol").post(authenticate, authorize, this.controller.grant.bind(this.controller));
    app
      .route("/api/concesiones-rol/:id/deactivate")
      .patch(authenticate, authorize, this.controller.deactivate.bind(this.controller));
    app
      .route("/api/concesiones-rol/:id/reactivate")
      .patch(authenticate, authorize, this.controller.reactivate.bind(this.controller));
  }
}
