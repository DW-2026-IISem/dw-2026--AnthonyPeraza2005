import { Application } from "express";
import { ContributorController } from "./contributor.controller";

export class ContributorRoutes {
  public contributorController: ContributorController = new ContributorController();

  public routes(app: Application): void {
    app.get("/api/contribuyentes", this.contributorController.getAll.bind(this.contributorController));
    app.get("/api/contribuyentes/:id", this.contributorController.getOne.bind(this.contributorController));
    app.post("/api/contribuyentes", this.contributorController.create.bind(this.contributorController));
    app.put("/api/contribuyentes/:id", this.contributorController.updatePut.bind(this.contributorController));
    app.patch("/api/contribuyentes/:id", this.contributorController.updatePatch.bind(this.contributorController));
    app.delete("/api/contribuyentes/:id", this.contributorController.deletePhysical.bind(this.contributorController));
    app.patch(
      "/api/contribuyentes/:id/deactivate",
      this.contributorController.deleteLogical.bind(this.contributorController)
    );
  }
}
