import { Application } from "express";
import { ContributionController } from "./contribution.controller";

export class ContributionRoutes {
  public contributionController: ContributionController = new ContributionController();

  public routes(app: Application): void {
    app.get("/api/contribuciones", this.contributionController.getAll);
    app.get("/api/contribuciones/:id", this.contributionController.getOne);
    app.post("/api/contribuciones", this.contributionController.create);
    app.put("/api/contribuciones/:id", this.contributionController.updatePut);
    app.patch("/api/contribuciones/:id", this.contributionController.updatePatch);
    app.delete("/api/contribuciones/:id/fisico", this.contributionController.deletePhysical);
    app.patch("/api/contribuciones/:id/logico", this.contributionController.deleteLogical);
  }
}
