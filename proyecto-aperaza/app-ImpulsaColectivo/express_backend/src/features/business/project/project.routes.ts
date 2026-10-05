import { Application } from "express";
import { ProjectController } from "./project.controller";

export class ProjectRoutes {
  public projectController: ProjectController = new ProjectController();

  public routes(app: Application): void {
    app.get("/api/proyectos", this.projectController.getAll.bind(this.projectController));
    app.get("/api/proyectos/:id", this.projectController.getOne.bind(this.projectController));
    app.post("/api/proyectos", this.projectController.create.bind(this.projectController));
    app.put("/api/proyectos/:id", this.projectController.updatePut.bind(this.projectController));
    app.patch("/api/proyectos/:id", this.projectController.updatePatch.bind(this.projectController));
    app.delete("/api/proyectos/:id", this.projectController.deletePhysical.bind(this.projectController));
    app.patch(
      "/api/proyectos/:id/deactivate",
      this.projectController.deleteLogical.bind(this.projectController)
    );
  }
}
