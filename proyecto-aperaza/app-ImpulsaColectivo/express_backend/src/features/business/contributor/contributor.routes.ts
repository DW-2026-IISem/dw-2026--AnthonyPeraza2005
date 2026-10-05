import { Application } from "express";
import { authenticate, authorize } from "../../auth/access";
import { ContributorController } from "./contributor.controller";

export class ContributorRoutes {
  public contributorController: ContributorController = new ContributorController();

  public routes(app: Application): void {
    app.get("/api/contribuyentes", authenticate, authorize, this.contributorController.getAll.bind(this.contributorController));
    app.get("/api/contribuyentes/:id", authenticate, authorize, this.contributorController.getOne.bind(this.contributorController));
    app.post("/api/contribuyentes", authenticate, authorize, this.contributorController.create.bind(this.contributorController));
    app.put("/api/contribuyentes/:id", authenticate, authorize, this.contributorController.updatePut.bind(this.contributorController));
    app.patch("/api/contribuyentes/:id", authenticate, authorize, this.contributorController.updatePatch.bind(this.contributorController));
    app.delete("/api/contribuyentes/:id", authenticate, authorize, this.contributorController.deletePhysical.bind(this.contributorController));
    app.patch(
      "/api/contribuyentes/:id/deactivate",
      authenticate, authorize, this.contributorController.deleteLogical.bind(this.contributorController)
    );
  }
}
