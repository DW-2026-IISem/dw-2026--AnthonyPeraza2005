import { Application } from "express";
import { authenticate, authorize } from "../access";
import { RolesController } from "./roles.controller";

/**
 * Rutas del feature Roles.
 * Modalidad 3 — JWT + RBAC: cada ruta pasa por `authenticate` y luego `authorize`.
 */
export class RolesRoutes {
  private readonly controller = new RolesController();

  public routes(app: Application): void {
    app.route("/api/roles").get(authenticate, authorize, this.controller.getAll.bind(this.controller));
    app.route("/api/roles/:id/deactivate").patch(authenticate, authorize, this.controller.deleteLogical.bind(this.controller));
    app
      .route("/api/roles/:id")
      .get(authenticate, authorize, this.controller.getOne.bind(this.controller))
      .put(authenticate, authorize, this.controller.updatePut.bind(this.controller))
      .patch(authenticate, authorize, this.controller.updatePatch.bind(this.controller))
      .delete(authenticate, authorize, this.controller.deletePhysical.bind(this.controller));
    app.route("/api/roles").post(authenticate, authorize, this.controller.create.bind(this.controller));
  }
}
