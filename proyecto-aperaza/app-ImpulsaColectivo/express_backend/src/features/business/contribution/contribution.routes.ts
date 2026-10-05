import { Application } from "express";
import { authenticate, authorize } from "../../auth/access";
import { ContributionController } from "./contribution.controller";

export class ContributionRoutes {
  public contributionController: ContributionController = new ContributionController();

  public routes(app: Application): void {
    app.get("/api/contribuciones", authenticate, authorize, this.contributionController.getAll.bind(this.contributionController));
    app.get("/api/contribuciones/:id", authenticate, authorize, this.contributionController.getOne.bind(this.contributionController));
    app.post("/api/contribuciones", authenticate, authorize, this.contributionController.create.bind(this.contributionController));
    app.put("/api/contribuciones/:id", authenticate, authorize, this.contributionController.updatePut.bind(this.contributionController));
    app.patch("/api/contribuciones/:id", authenticate, authorize, this.contributionController.updatePatch.bind(this.contributionController));
    app.delete("/api/contribuciones/:id", authenticate, authorize, this.contributionController.deletePhysical.bind(this.contributionController));
    app.patch(
      "/api/contribuciones/:id/deactivate",
      authenticate, authorize, this.contributionController.deleteLogical.bind(this.contributionController)
    );
  }
}
