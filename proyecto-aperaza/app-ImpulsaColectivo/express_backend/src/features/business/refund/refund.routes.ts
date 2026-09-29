import { Application } from "express";
import { RefundController } from "./refund.controller";

export class RefundRoutes {
  public refundController: RefundController = new RefundController();

  public routes(app: Application): void {
    app.get("/api/reembolsos", this.refundController.getAll);
    app.get("/api/reembolsos/:id", this.refundController.getOne);
    app.post("/api/reembolsos", this.refundController.create);
    app.put("/api/reembolsos/:id", this.refundController.updatePut);
    app.patch("/api/reembolsos/:id", this.refundController.updatePatch);
    app.delete("/api/reembolsos/:id/fisico", this.refundController.deletePhysical);
    app.patch("/api/reembolsos/:id/logico", this.refundController.deleteLogical);
  }
}
