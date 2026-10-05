import { Application } from "express";
import { UsersController } from "./users.controller";

/**
 * Rutas del feature Users.
 *
 * TEMPORAL: sin middlewares de acceso (SIN AUTH). En ISS-21 se protegen con
 * `authenticate` + `authorize` (modalidad JWT + RBAC) junto con el resto.
 */
export class UsersRoutes {
  private readonly controller = new UsersController();

  public routes(app: Application): void {
    app.route("/api/usuarios").get(this.controller.getAll.bind(this.controller));
    app.route("/api/usuarios/:id/deactivate").patch(this.controller.deleteLogical.bind(this.controller));
    app.route("/api/usuarios/:id/password").patch(this.controller.changePassword.bind(this.controller));
    app
      .route("/api/usuarios/:id")
      .get(this.controller.getOne.bind(this.controller))
      .put(this.controller.updatePut.bind(this.controller))
      .patch(this.controller.updatePatch.bind(this.controller))
      .delete(this.controller.deletePhysical.bind(this.controller));
    app.route("/api/usuarios").post(this.controller.create.bind(this.controller));
  }
}
