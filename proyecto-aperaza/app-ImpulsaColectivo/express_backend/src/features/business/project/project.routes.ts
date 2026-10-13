import { Application } from "express";
import { authenticate, authorize } from "../../auth/access";
import { ProjectController } from "./project.controller";

export class ProjectRoutes {
  public projectController: ProjectController = new ProjectController();

  public routes(app: Application): void {
    app.get("/api/proyectos",authenticate, this.projectController.getAll.bind(this.projectController));
    app.get("/api/proyectos/:id", authenticate, this.projectController.getOne.bind(this.projectController));
    app.post("/api/proyectos", authenticate, this.projectController.create.bind(this.projectController));
    app.put("/api/proyectos/:id", authenticate, this.projectController.updatePut.bind(this.projectController));
    app.patch("/api/proyectos/:id", authenticate, this.projectController.updatePatch.bind(this.projectController));
    app.delete("/api/proyectos/:id", authenticate, this.projectController.deletePhysical.bind(this.projectController));
    app.patch("/api/proyectos/:id/deactivate", authenticate, this.projectController.deleteLogical.bind(this.projectController)
    );
  }
}
