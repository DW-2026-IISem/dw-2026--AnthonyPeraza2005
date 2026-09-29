import { Application } from "express";
import { CommissionController } from "./commission.controller";

export class CommissionRoutes {
  public commissionController: CommissionController = new CommissionController();

  public routes(app: Application): void {
    app.get("/api/comisiones", this.commissionController.getAll);
    app.get("/api/comisiones/:id", this.commissionController.getOne);
    app.post("/api/comisiones", this.commissionController.create);
    app.put("/api/comisiones/:id", this.commissionController.updatePut);
    app.patch("/api/comisiones/:id", this.commissionController.updatePatch);
    app.delete("/api/comisiones/:id/fisico", this.commissionController.deletePhysical);
    app.patch("/api/comisiones/:id/logico", this.commissionController.deleteLogical);
  }
}
