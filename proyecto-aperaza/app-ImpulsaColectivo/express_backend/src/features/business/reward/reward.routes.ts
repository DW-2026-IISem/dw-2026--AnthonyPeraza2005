import { Application } from "express";
import { RewardController } from "./reward.controller";

export class RewardRoutes {
  public rewardController: RewardController = new RewardController();

  public routes(app: Application): void {
    app.get("/api/recompensas", this.rewardController.getAll.bind(this.rewardController));
    app.get("/api/recompensas/:id", this.rewardController.getOne.bind(this.rewardController));
    app.post("/api/recompensas", this.rewardController.create.bind(this.rewardController));
    app.put("/api/recompensas/:id", this.rewardController.updatePut.bind(this.rewardController));
    app.patch("/api/recompensas/:id", this.rewardController.updatePatch.bind(this.rewardController));
    app.delete("/api/recompensas/:id", this.rewardController.deletePhysical.bind(this.rewardController));
    app.patch(
      "/api/recompensas/:id/deactivate",
      this.rewardController.deleteLogical.bind(this.rewardController)
    );
  }
}
