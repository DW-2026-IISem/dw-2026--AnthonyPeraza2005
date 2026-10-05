import { Application } from "express";
import { ResourcesController } from "./resources.controller";

/**
 * Rutas del feature Resources.
 * TEMPORAL: SIN AUTH. En ISS-21 pasan a JWT + RBAC (`authenticate` + `authorize`).
 */
export class ResourcesRoutes {
  private readonly controller = new ResourcesController();

  public routes(app: Application): void {
    app.route("/api/recursos").get(this.controller.getAll.bind(this.controller));
    app.route("/api/recursos/:id/deactivate").patch(this.controller.deleteLogical.bind(this.controller));
    app
      .route("/api/recursos/:id")
      .get(this.controller.getOne.bind(this.controller))
      .put(this.controller.updatePut.bind(this.controller))
      .patch(this.controller.updatePatch.bind(this.controller))
      .delete(this.controller.deletePhysical.bind(this.controller));
    app.route("/api/recursos").post(this.controller.create.bind(this.controller));
  }
}
