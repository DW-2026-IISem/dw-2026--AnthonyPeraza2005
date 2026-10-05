import { Application } from "express";
import { authenticate, authorize } from "../../auth/access";
import { ProjectAuditController } from "./project-audit.controller";

export class ProjectAuditRoutes {
  private readonly controller = new ProjectAuditController();

  public routes(app: Application): void {
    app.route("/api/auditorias-proyecto").get(authenticate, authorize, this.controller.getAll.bind(this.controller));
    app.route("/api/auditorias-proyecto/:id/deactivate").patch(authenticate, authorize, this.controller.deleteLogical.bind(this.controller));
    app
      .route("/api/auditorias-proyecto/:id")
      .get(authenticate, authorize, this.controller.getOne.bind(this.controller))
      .put(authenticate, authorize, this.controller.updatePut.bind(this.controller))
      .patch(authenticate, authorize, this.controller.updatePatch.bind(this.controller))
      .delete(authenticate, authorize, this.controller.deletePhysical.bind(this.controller));
    app.route("/api/auditorias-proyecto").post(authenticate, authorize, this.controller.create.bind(this.controller));
  }
}
