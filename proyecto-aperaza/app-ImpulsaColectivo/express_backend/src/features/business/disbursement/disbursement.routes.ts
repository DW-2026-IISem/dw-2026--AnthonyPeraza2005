import { Application } from "express";
import { DisbursementController } from "./disbursement.controller";

export class DisbursementRoutes {
  private readonly controller = new DisbursementController();

  public routes(app: Application): void {
    app.route("/api/desembolsos").get(this.controller.getAll.bind(this.controller));
    app.route("/api/desembolsos/:id/deactivate").patch(this.controller.deleteLogical.bind(this.controller));
    app
      .route("/api/desembolsos/:id")
      .get(this.controller.getOne.bind(this.controller))
      .put(this.controller.updatePut.bind(this.controller))
      .patch(this.controller.updatePatch.bind(this.controller))
      .delete(this.controller.deletePhysical.bind(this.controller));
    app.route("/api/desembolsos").post(this.controller.create.bind(this.controller));
  }
}
