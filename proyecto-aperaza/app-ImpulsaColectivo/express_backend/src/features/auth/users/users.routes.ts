import { Application } from "express";
import { authenticate, authorize } from "../access";
import { UsersController } from "./users.controller";

/**
 * Rutas del feature Users.
 *
 * Modalidad 3 — JWT + RBAC: cada ruta pasa por `authenticate` y luego `authorize`.
 */
export class UsersRoutes {
  private readonly controller = new UsersController();

  public routes(app: Application): void {
    app.route("/api/usuarios").get(authenticate, authorize, this.controller.getAll.bind(this.controller));
    app.route("/api/usuarios/:id/deactivate").patch(authenticate, authorize, this.controller.deleteLogical.bind(this.controller));
    app.route("/api/usuarios/:id/password").patch(authenticate, authorize, this.controller.changePassword.bind(this.controller));
    app.route("/api/usuarios/:id/permisos").get(authenticate, authorize, this.controller.getEffectivePermissions.bind(this.controller));
    app
      .route("/api/usuarios/:id")
      .get(authenticate, authorize, this.controller.getOne.bind(this.controller))
      .put(authenticate, authorize, this.controller.updatePut.bind(this.controller))
      .patch(authenticate, authorize, this.controller.updatePatch.bind(this.controller))
      .delete(authenticate, authorize, this.controller.deletePhysical.bind(this.controller));
    app.route("/api/usuarios").post(authenticate, authorize, this.controller.create.bind(this.controller));
  }
}
