import { Application } from "express";
import { GoalController } from "./goal.controller";

export class GoalRoutes {
  public goalController: GoalController = new GoalController();

  public routes(app: Application): void {
    // ================== RUTAS SIN AUTENTICACIÓN / SIN MIDDLEWARE JWT ==================

    // getAll
    app
      .route("/api/metas")
      .get(this.goalController.getAll.bind(this.goalController));

    // getOne
    app
      .route("/api/metas/:id")
      .get(this.goalController.getOne.bind(this.goalController));

    // create
    app
      .route("/api/metas")
      .post(this.goalController.create.bind(this.goalController));

    // update (PUT / PATCH)
    app
      .route("/api/metas/:id")
      .put(this.goalController.updatePut.bind(this.goalController))
      .patch(this.goalController.updatePatch.bind(this.goalController));

    // delete físico
    app
      .route("/api/metas/:id")
      .delete(this.goalController.deletePhysical.bind(this.goalController));

    // delete lógico
    app
      .route("/api/metas/:id/deactivate")
      .patch(this.goalController.deleteLogical.bind(this.goalController));
  }
}
