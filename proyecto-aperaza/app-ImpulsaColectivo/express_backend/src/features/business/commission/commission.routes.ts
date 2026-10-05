import { Application } from "express";
import { authenticate, authorize } from "../../auth/access";
import { CommissionController } from "./commission.controller";

export class CommissionRoutes {
  private readonly controller = new CommissionController();

  public routes(app: Application): void {
    app.route("/api/comisiones").get(authenticate, authorize, this.controller.getAll.bind(this.controller));
    app.route("/api/comisiones/:id/deactivate").patch(authenticate, authorize, this.controller.deleteLogical.bind(this.controller));
    app
      .route("/api/comisiones/:id")
      .get(authenticate, authorize, this.controller.getOne.bind(this.controller))
      .put(authenticate, authorize, this.controller.updatePut.bind(this.controller))
      .patch(authenticate, authorize, this.controller.updatePatch.bind(this.controller))
      .delete(authenticate, authorize, this.controller.deletePhysical.bind(this.controller));
    app.route("/api/comisiones").post(authenticate, authorize, this.controller.create.bind(this.controller));
  }
}
