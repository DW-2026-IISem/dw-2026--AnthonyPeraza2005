import { Application } from "express";
import { authenticate, authorize } from "../access";
import { ResourcesController } from "./resources.controller";

/**
 * Rutas del feature Resources.
 * Modalidad 3 — JWT + RBAC: cada ruta pasa por `authenticate` y luego `authorize`.
 */
export class ResourcesRoutes {
  private readonly controller = new ResourcesController();

  public routes(app: Application): void {
    app.route("/api/recursos").get(authenticate, authorize, this.controller.getAll.bind(this.controller));
    app.route("/api/recursos/:id/deactivate").patch(authenticate, authorize, this.controller.deleteLogical.bind(this.controller));
    app
      .route("/api/recursos/:id")
      .get(authenticate, authorize, this.controller.getOne.bind(this.controller))
      .put(authenticate, authorize, this.controller.updatePut.bind(this.controller))
      .patch(authenticate, authorize, this.controller.updatePatch.bind(this.controller))
      .delete(authenticate, authorize, this.controller.deletePhysical.bind(this.controller));
    app.route("/api/recursos").post(authenticate, authorize, this.controller.create.bind(this.controller));
  }
}
