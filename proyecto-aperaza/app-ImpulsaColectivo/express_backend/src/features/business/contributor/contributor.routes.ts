import { Application } from "express";
import { ContributorController } from "./contributor.controller";

export class ContributorRoutes {
  public contributorController: ContributorController = new ContributorController();

  public routes(app: Application): void {
    // ================== RUTAS SIN AUTENTICACIÓN / SIN MIDDLEWARE JWT ==================

    // getAll
    app
      .route("/api/contribuyentes")
      .get(this.contributorController.getAll.bind(this.contributorController));

    // getOne
    app
      .route("/api/contribuyentes/:id")
      .get(this.contributorController.getOne.bind(this.contributorController));

    // create
    app
      .route("/api/contribuyentes")
      .post(this.contributorController.create.bind(this.contributorController));

    // update (PUT / PATCH)
    app
      .route("/api/contribuyentes/:id")
      .put(this.contributorController.updatePut.bind(this.contributorController))
      .patch(this.contributorController.updatePatch.bind(this.contributorController));

    // delete físico
    app
      .route("/api/contribuyentes/:id")
      .delete(this.contributorController.deletePhysical.bind(this.contributorController));

    // delete lógico
    app
      .route("/api/contribuyentes/:id/deactivate")
      .patch(this.contributorController.deleteLogical.bind(this.contributorController));
  }
}
