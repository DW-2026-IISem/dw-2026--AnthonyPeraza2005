import { Application } from "express";
import { authenticate, authorize } from "../../auth/access";
import { PromoterController } from "./promoter.controller";

export class PromoterRoutes {
  public promoterController: PromoterController = new PromoterController();

  public routes(app: Application): void {
    app.get("/api/promotores", authenticate, authorize, this.promoterController.getAll.bind(this.promoterController));
    app.get("/api/promotores/:id", authenticate, authorize, this.promoterController.getOne.bind(this.promoterController));
    app.post("/api/promotores", authenticate, authorize, this.promoterController.create.bind(this.promoterController));
    app.put("/api/promotores/:id", authenticate, authorize, this.promoterController.updatePut.bind(this.promoterController));
    app.patch("/api/promotores/:id", authenticate, authorize, this.promoterController.updatePatch.bind(this.promoterController));
    app.delete("/api/promotores/:id", authenticate, authorize, this.promoterController.deletePhysical.bind(this.promoterController));
    app.patch(
      "/api/promotores/:id/deactivate",
      authenticate, authorize, this.promoterController.deleteLogical.bind(this.promoterController)
    );
  }
}
