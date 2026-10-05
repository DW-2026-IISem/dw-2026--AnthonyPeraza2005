import { Application } from "express";
import { GoalController } from "./goal.controller";

export class GoalRoutes {
  public goalController: GoalController = new GoalController();

  public routes(app: Application): void {
    app.get("/api/metas", this.goalController.getAll.bind(this.goalController));
    app.get("/api/metas/:id", this.goalController.getOne.bind(this.goalController));
    app.post("/api/metas", this.goalController.create.bind(this.goalController));
    app.put("/api/metas/:id", this.goalController.updatePut.bind(this.goalController));
    app.patch("/api/metas/:id", this.goalController.updatePatch.bind(this.goalController));
    app.delete("/api/metas/:id", this.goalController.deletePhysical.bind(this.goalController));
    app.patch(
      "/api/metas/:id/deactivate",
      this.goalController.deleteLogical.bind(this.goalController)
    );
  }
}
