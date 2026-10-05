import { Application } from "express";
import { authenticate, authorize } from "../../auth/access";
import { RewardController } from "./reward.controller";

export class RewardRoutes {
  public rewardController: RewardController = new RewardController();

  public routes(app: Application): void {
    app.get("/api/recompensas", authenticate, authorize, this.rewardController.getAll.bind(this.rewardController));
    app.get("/api/recompensas/:id", authenticate, authorize, this.rewardController.getOne.bind(this.rewardController));
    app.post("/api/recompensas", authenticate, authorize, this.rewardController.create.bind(this.rewardController));
    app.put("/api/recompensas/:id", authenticate, authorize, this.rewardController.updatePut.bind(this.rewardController));
    app.patch("/api/recompensas/:id", authenticate, authorize, this.rewardController.updatePatch.bind(this.rewardController));
    app.delete("/api/recompensas/:id", authenticate, authorize, this.rewardController.deletePhysical.bind(this.rewardController));
    app.patch(
      "/api/recompensas/:id/deactivate",
      authenticate, authorize, this.rewardController.deleteLogical.bind(this.rewardController)
    );
  }
}
