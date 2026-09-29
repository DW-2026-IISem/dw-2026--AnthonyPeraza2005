import { Application } from "express";
import { DisbursementController } from "./disbursement.controller";

export class DisbursementRoutes {
  public disbursementController: DisbursementController = new DisbursementController();

  public routes(app: Application): void {
    app.get("/api/desembolsos", this.disbursementController.getAll);
    app.get("/api/desembolsos/:id", this.disbursementController.getOne);
    app.post("/api/desembolsos", this.disbursementController.create);
    app.put("/api/desembolsos/:id", this.disbursementController.updatePut);
    app.patch("/api/desembolsos/:id", this.disbursementController.updatePatch);
    app.delete("/api/desembolsos/:id/fisico", this.disbursementController.deletePhysical);
    app.patch("/api/desembolsos/:id/logico", this.disbursementController.deleteLogical);
  }
}
