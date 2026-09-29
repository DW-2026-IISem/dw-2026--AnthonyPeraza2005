import { Application } from "express";
import { ProjectController } from "./project.controller";

export class ProjectRoutes {
  public projectController: ProjectController = new ProjectController();

  public routes(app: Application): void {
    // ================== RUTAS SIN AUTENTICACIÓN / SIN MIDDLEWARE JWT ==================

    // getAll
    app
      .route("/api/proyectos")
      .get(this.projectController.getAll.bind(this.projectController));

    // getOne
    app
      .route("/api/proyectos/:id")
      .get(this.projectController.getOne.bind(this.projectController));

    // create
    app
      .route("/api/proyectos")
      .post(this.projectController.create.bind(this.projectController));

    // update (PUT / PATCH)
    app
      .route("/api/proyectos/:id")
      .put(this.projectController.updatePut.bind(this.projectController))
      .patch(this.projectController.updatePatch.bind(this.projectController));

    // delete físico
    app
      .route("/api/proyectos/:id")
      .delete(this.projectController.deletePhysical.bind(this.projectController));

    // delete lógico
    app
      .route("/api/proyectos/:id/deactivate")
      .patch(this.projectController.deleteLogical.bind(this.projectController));
  }
}
