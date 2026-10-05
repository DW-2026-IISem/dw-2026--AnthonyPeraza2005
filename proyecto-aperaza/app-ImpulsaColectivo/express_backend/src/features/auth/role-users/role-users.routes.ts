import { Application } from "express";
import { RoleUsersController } from "./role-users.controller";

/**
 * Rutas del feature RoleUsers: vía administrativa para asignar un rol a un
 * usuario (`POST /api/asignaciones-rol` con `{ user_id, role_id }`).
 *
 * No hay borrado físico: retirar un rol es `/deactivate` y es reversible
 * (`/reactivate`).
 *
 * TEMPORAL: SIN AUTH. En ISS-21 pasan a JWT + RBAC.
 */
export class RoleUsersRoutes {
  private readonly controller = new RoleUsersController();

  public routes(app: Application): void {
    app.route("/api/asignaciones-rol").get(this.controller.getAll.bind(this.controller));
    app.route("/api/asignaciones-rol/:id").get(this.controller.getOne.bind(this.controller));
    app.route("/api/asignaciones-rol").post(this.controller.assign.bind(this.controller));
    app
      .route("/api/asignaciones-rol/:id/deactivate")
      .patch(this.controller.deactivate.bind(this.controller));
    app
      .route("/api/asignaciones-rol/:id/reactivate")
      .patch(this.controller.reactivate.bind(this.controller));
  }
}
