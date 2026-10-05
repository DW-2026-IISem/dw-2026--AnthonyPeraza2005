import { Application } from "express";
import { authenticate, authorize } from "../../auth/access";
import { DisbursementController } from "./disbursement.controller";

export class DisbursementRoutes {
  private readonly controller = new DisbursementController();

  public routes(app: Application): void {
    app.route("/api/desembolsos").get(authenticate, authorize, this.controller.getAll.bind(this.controller));
    app.route("/api/desembolsos/:id/deactivate").patch(authenticate, authorize, this.controller.deleteLogical.bind(this.controller));
    app
      .route("/api/desembolsos/:id")
      .get(authenticate, authorize, this.controller.getOne.bind(this.controller))
      .put(authenticate, authorize, this.controller.updatePut.bind(this.controller))
      .patch(authenticate, authorize, this.controller.updatePatch.bind(this.controller))
      .delete(authenticate, authorize, this.controller.deletePhysical.bind(this.controller));
    app.route("/api/desembolsos").post(authenticate, authorize, this.controller.create.bind(this.controller));
  }
}
