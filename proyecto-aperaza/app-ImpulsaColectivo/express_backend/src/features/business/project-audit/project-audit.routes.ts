import { Application } from "express";
import { ProjectAuditController } from "./project-audit.controller";

export class ProjectAuditRoutes {
  private readonly controller = new ProjectAuditController();

  public routes(app: Application): void {
    app.route("/api/auditorias-proyecto").get(this.controller.getAll.bind(this.controller));
    app.route("/api/auditorias-proyecto/:id/deactivate").patch(this.controller.deleteLogical.bind(this.controller));
    app
      .route("/api/auditorias-proyecto/:id")
      .get(this.controller.getOne.bind(this.controller))
      .put(this.controller.updatePut.bind(this.controller))
      .patch(this.controller.updatePatch.bind(this.controller))
      .delete(this.controller.deletePhysical.bind(this.controller));
    app.route("/api/auditorias-proyecto").post(this.controller.create.bind(this.controller));
  }
}
