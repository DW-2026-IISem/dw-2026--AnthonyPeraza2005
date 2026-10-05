import { Application } from "express";
import { SessionController } from "./session.controller";
import { authenticate } from "../access";

/**
 * Rutas del feature Session — **las modalidades OPEN y JWT en un solo archivo**.
 *
 * | Ruta | Modalidad | Middleware |
 * |---|---|---|
 * | `POST /api/sesion/login`   | OPEN | — |
 * | `POST /api/sesion/refresh` | OPEN (credencial de sesión) | — |
 * | `POST /api/sesion/logout`  | OPEN (credencial de sesión) | — |
 * | `GET  /api/sesion/perfil`  | JWT | `authenticate` |
 * | `GET  /api/permisos`       | JWT | `authenticate` |
 *
 * Ninguna lleva `authorize`: la autorización granular no aplica a los puntos de
 * acceso previos o ajenos a la matriz. `/api/permisos` devuelve los **permisos
 * efectivos** del usuario autenticado (la misma consulta que usa `authorize`),
 * ideal para depurar el RBAC.
 */
export class SessionRoutes {
  private readonly controller = new SessionController();

  public routes(app: Application): void {
    // login (OPEN)
    app.route("/api/sesion/login").post(this.controller.login.bind(this.controller));

    // refresh (OPEN + refresh token)
    app.route("/api/sesion/refresh").post(this.controller.refresh.bind(this.controller));

    // logout (OPEN + refresh token)
    app.route("/api/sesion/logout").post(this.controller.logout.bind(this.controller));

    // perfil (JWT)
    app
      .route("/api/sesion/perfil")
      .get(authenticate, this.controller.profile.bind(this.controller));

    // permisos efectivos del usuario autenticado (JWT)
    app
      .route("/api/permisos")
      .get(authenticate, this.controller.myPermissions.bind(this.controller));
  }
}
