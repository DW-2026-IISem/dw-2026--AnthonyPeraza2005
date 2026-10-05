import { Application } from "express";
import { RolesController } from "./roles.controller";

/**
 * Rutas del feature Roles.
 * TEMPORAL: SIN AUTH. En ISS-21 pasan a JWT + RBAC (`authenticate` + `authorize`).
 */
export class RolesRoutes {
  private readonly controller = new RolesController();

  public routes(app: Application): void {
    app.route("/api/roles").get(this.controller.getAll.bind(this.controller));
    app.route("/api/roles/:id/deactivate").patch(this.controller.deleteLogical.bind(this.controller));
    app
      .route("/api/roles/:id")
      .get(this.controller.getOne.bind(this.controller))
      .put(this.controller.updatePut.bind(this.controller))
      .patch(this.controller.updatePatch.bind(this.controller))
      .delete(this.controller.deletePhysical.bind(this.controller));
    app.route("/api/roles").post(this.controller.create.bind(this.controller));
  }
}
