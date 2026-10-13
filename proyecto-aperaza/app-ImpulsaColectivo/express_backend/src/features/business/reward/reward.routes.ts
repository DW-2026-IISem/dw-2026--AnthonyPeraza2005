import { Application } from "express";
import { authenticate, authorize } from "../../auth/access";
import { RewardController } from "./reward.controller";

export class RewardRoutes {
  public rewardController: RewardController = new RewardController();

  public routes(app: Application): void {
    app.get("/api/recompensas", authenticate, this.rewardController.getAll.bind(this.rewardController));
    app.get("/api/recompensas/:id", authenticate, this.rewardController.getOne.bind(this.rewardController));
    app.post("/api/recompensas", authenticate, this.rewardController.create.bind(this.rewardController));
    app.put("/api/recompensas/:id", authenticate, this.rewardController.updatePut.bind(this.rewardController));
    app.patch("/api/recompensas/:id", authenticate, this.rewardController.updatePatch.bind(this.rewardController));
    app.delete("/api/recompensas/:id", authenticate, this.rewardController.deletePhysical.bind(this.rewardController));
    app.patch(
      "/api/recompensas/:id/deactivate",
      authenticate,
       this.rewardController.deleteLogical.bind(this.rewardController)
    );
  }
}
