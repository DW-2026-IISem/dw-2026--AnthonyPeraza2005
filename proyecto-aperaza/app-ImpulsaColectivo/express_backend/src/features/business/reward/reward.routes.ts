import { Application } from "express";
import { RewardController } from "./reward.controller";

export class RewardRoutes {
  public rewardController: RewardController = new RewardController();

  public routes(app: Application): void {
    // ================== RUTAS SIN AUTENTICACIÓN / SIN MIDDLEWARE JWT ==================

    // getAll
    app
      .route("/api/recompensas")
      .get(this.rewardController.getAll.bind(this.rewardController));

    // getOne
    app
      .route("/api/recompensas/:id")
      .get(this.rewardController.getOne.bind(this.rewardController));

    // create
    app
      .route("/api/recompensas")
      .post(this.rewardController.create.bind(this.rewardController));

    // update (PUT / PATCH)
    app
      .route("/api/recompensas/:id")
      .put(this.rewardController.updatePut.bind(this.rewardController))
      .patch(this.rewardController.updatePatch.bind(this.rewardController));

    // delete físico
    app
      .route("/api/recompensas/:id")
      .delete(this.rewardController.deletePhysical.bind(this.rewardController));

    // delete lógico
    app
      .route("/api/recompensas/:id/deactivate")
      .patch(this.rewardController.deleteLogical.bind(this.rewardController));
  }
}
