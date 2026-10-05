import { Application } from "express";
import { authenticate, authorize } from "../../auth/access";
import { RefundController } from "./refund.controller";

export class RefundRoutes {
  private readonly controller = new RefundController();

  public routes(app: Application): void {
    app.route("/api/reembolsos").get(authenticate, authorize, this.controller.getAll.bind(this.controller));
    app.route("/api/reembolsos/:id/deactivate").patch(authenticate, authorize, this.controller.deleteLogical.bind(this.controller));
    app
      .route("/api/reembolsos/:id")
      .get(authenticate, authorize, this.controller.getOne.bind(this.controller))
      .put(authenticate, authorize, this.controller.updatePut.bind(this.controller))
      .patch(authenticate, authorize, this.controller.updatePatch.bind(this.controller))
      .delete(authenticate, authorize, this.controller.deletePhysical.bind(this.controller));
    app.route("/api/reembolsos").post(authenticate, authorize, this.controller.create.bind(this.controller));
  }
}
