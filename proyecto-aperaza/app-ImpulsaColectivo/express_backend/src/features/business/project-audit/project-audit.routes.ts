import { Application } from "express";
import { ProjectAuditController } from "./project-audit.controller";

export class ProjectAuditRoutes {
  public projectAuditController: ProjectAuditController = new ProjectAuditController();

  public routes(app: Application): void {
    app.get("/api/auditorias-proyecto", this.projectAuditController.getAll);
    app.get("/api/auditorias-proyecto/:id", this.projectAuditController.getOne);
    app.post("/api/auditorias-proyecto", this.projectAuditController.create);
    app.put("/api/auditorias-proyecto/:id", this.projectAuditController.updatePut);
    app.patch("/api/auditorias-proyecto/:id", this.projectAuditController.updatePatch);
    app.delete("/api/auditorias-proyecto/:id/fisico", this.projectAuditController.deletePhysical);
    app.patch("/api/auditorias-proyecto/:id/logico", this.projectAuditController.deleteLogical);
  }
}
