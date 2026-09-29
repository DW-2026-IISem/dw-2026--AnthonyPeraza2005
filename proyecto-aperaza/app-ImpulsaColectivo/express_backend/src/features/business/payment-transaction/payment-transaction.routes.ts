import { Application } from "express";
import { PaymentTransactionController } from "./payment-transaction.controller";

export class PaymentTransactionRoutes {
  public paymentTransactionController: PaymentTransactionController = new PaymentTransactionController();

  public routes(app: Application): void {
    app.get("/api/transacciones-pago", this.paymentTransactionController.getAll);
    app.get("/api/transacciones-pago/:id", this.paymentTransactionController.getOne);
    app.post("/api/transacciones-pago", this.paymentTransactionController.create);
    app.put("/api/transacciones-pago/:id", this.paymentTransactionController.updatePut);
    app.patch("/api/transacciones-pago/:id", this.paymentTransactionController.updatePatch);
    app.delete("/api/transacciones-pago/:id/fisico", this.paymentTransactionController.deletePhysical);
    app.patch("/api/transacciones-pago/:id/logico", this.paymentTransactionController.deleteLogical);
  }
}
