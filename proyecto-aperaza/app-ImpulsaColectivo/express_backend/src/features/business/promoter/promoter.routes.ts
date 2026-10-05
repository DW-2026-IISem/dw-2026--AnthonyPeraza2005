import { Application } from "express";
import { PromoterController } from "./promoter.controller";

export class PromoterRoutes {
  public promoterController: PromoterController = new PromoterController();

  public routes(app: Application): void {
    app.get("/api/promotores", this.promoterController.getAll.bind(this.promoterController));
    app.get("/api/promotores/:id", this.promoterController.getOne.bind(this.promoterController));
    app.post("/api/promotores", this.promoterController.create.bind(this.promoterController));
    app.put("/api/promotores/:id", this.promoterController.updatePut.bind(this.promoterController));
    app.patch("/api/promotores/:id", this.promoterController.updatePatch.bind(this.promoterController));
    app.delete("/api/promotores/:id", this.promoterController.deletePhysical.bind(this.promoterController));
    app.patch(
      "/api/promotores/:id/deactivate",
      this.promoterController.deleteLogical.bind(this.promoterController)
    );
  }
}
