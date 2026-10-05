import { Application } from "express";
import { authenticate, authorize } from "../../auth/access";
import { GoalController } from "./goal.controller";

export class GoalRoutes {
  public goalController: GoalController = new GoalController();

  public routes(app: Application): void {
    app.get("/api/metas", authenticate, authorize, this.goalController.getAll.bind(this.goalController));
    app.get("/api/metas/:id", authenticate, authorize, this.goalController.getOne.bind(this.goalController));
    app.post("/api/metas", authenticate, authorize, this.goalController.create.bind(this.goalController));
    app.put("/api/metas/:id", authenticate, authorize, this.goalController.updatePut.bind(this.goalController));
    app.patch("/api/metas/:id", authenticate, authorize, this.goalController.updatePatch.bind(this.goalController));
    app.delete("/api/metas/:id", authenticate, authorize, this.goalController.deletePhysical.bind(this.goalController));
    app.patch(
      "/api/metas/:id/deactivate",
      authenticate, authorize, this.goalController.deleteLogical.bind(this.goalController)
    );
  }
}
