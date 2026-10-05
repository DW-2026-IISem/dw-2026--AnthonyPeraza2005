import { Application } from "express";
import { CommissionController } from "./commission.controller";

export class CommissionRoutes {
  private readonly controller = new CommissionController();

  public routes(app: Application): void {
    app.route("/api/comisiones").get(this.controller.getAll.bind(this.controller));
    app.route("/api/comisiones/:id/deactivate").patch(this.controller.deleteLogical.bind(this.controller));
    app
      .route("/api/comisiones/:id")
      .get(this.controller.getOne.bind(this.controller))
      .put(this.controller.updatePut.bind(this.controller))
      .patch(this.controller.updatePatch.bind(this.controller))
      .delete(this.controller.deletePhysical.bind(this.controller));
    app.route("/api/comisiones").post(this.controller.create.bind(this.controller));
  }
}
