import { Application } from "express";
import { RefundController } from "./refund.controller";

export class RefundRoutes {
  private readonly controller = new RefundController();

  public routes(app: Application): void {
    app.route("/api/reembolsos").get(this.controller.getAll.bind(this.controller));
    app.route("/api/reembolsos/:id/deactivate").patch(this.controller.deleteLogical.bind(this.controller));
    app
      .route("/api/reembolsos/:id")
      .get(this.controller.getOne.bind(this.controller))
      .put(this.controller.updatePut.bind(this.controller))
      .patch(this.controller.updatePatch.bind(this.controller))
      .delete(this.controller.deletePhysical.bind(this.controller));
    app.route("/api/reembolsos").post(this.controller.create.bind(this.controller));
  }
}
