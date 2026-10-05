import { Application } from "express";
import { ContributionController } from "./contribution.controller";

export class ContributionRoutes {
  public contributionController: ContributionController = new ContributionController();

  public routes(app: Application): void {
    app.get("/api/contribuciones", this.contributionController.getAll.bind(this.contributionController));
    app.get("/api/contribuciones/:id", this.contributionController.getOne.bind(this.contributionController));
    app.post("/api/contribuciones", this.contributionController.create.bind(this.contributionController));
    app.put("/api/contribuciones/:id", this.contributionController.updatePut.bind(this.contributionController));
    app.patch("/api/contribuciones/:id", this.contributionController.updatePatch.bind(this.contributionController));
    app.delete("/api/contribuciones/:id", this.contributionController.deletePhysical.bind(this.contributionController));
    app.patch(
      "/api/contribuciones/:id/deactivate",
      this.contributionController.deleteLogical.bind(this.contributionController)
    );
  }
}
