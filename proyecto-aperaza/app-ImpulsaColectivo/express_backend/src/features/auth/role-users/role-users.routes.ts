import { Application } from "express";
import { authenticate, authorize } from "../access";
import { RoleUsersController } from "./role-users.controller";

/**
 * Rutas del feature RoleUsers: vía administrativa para asignar un rol a un
 * usuario (`POST /api/asignaciones-rol` con `{ user_id, role_id }`).
 *
 * No hay borrado físico: retirar un rol es `/deactivate` y es reversible
 * (`/reactivate`).
 *
 * Modalidad 3 — JWT + RBAC: cada ruta pasa por `authenticate` y luego `authorize`.
 */
export class RoleUsersRoutes {
  private readonly controller = new RoleUsersController();

  public routes(app: Application): void {
    app.route("/api/asignaciones-rol").get(authenticate, authorize, this.controller.getAll.bind(this.controller));
    app.route("/api/asignaciones-rol/:id").get(authenticate, authorize, this.controller.getOne.bind(this.controller));
    app.route("/api/asignaciones-rol").post(authenticate, authorize, this.controller.assign.bind(this.controller));
    app
      .route("/api/asignaciones-rol/:id/deactivate")
      .patch(authenticate, authorize, this.controller.deactivate.bind(this.controller));
    app
      .route("/api/asignaciones-rol/:id/reactivate")
      .patch(authenticate, authorize, this.controller.reactivate.bind(this.controller));
  }
}
