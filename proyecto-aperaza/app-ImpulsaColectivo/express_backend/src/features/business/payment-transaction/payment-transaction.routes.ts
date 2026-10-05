import { Application } from "express";
import { PaymentTransactionController } from "./payment-transaction.controller";

export class PaymentTransactionRoutes {
  public paymentTransactionController: PaymentTransactionController = new PaymentTransactionController();

  public routes(app: Application): void {
    app.get(
      "/api/transacciones-pago",
      this.paymentTransactionController.getAll.bind(this.paymentTransactionController)
    );
    app.get(
      "/api/transacciones-pago/:id",
      this.paymentTransactionController.getOne.bind(this.paymentTransactionController)
    );
    app.post(
      "/api/transacciones-pago",
      this.paymentTransactionController.create.bind(this.paymentTransactionController)
    );
    app.put(
      "/api/transacciones-pago/:id",
      this.paymentTransactionController.updatePut.bind(this.paymentTransactionController)
    );
    app.patch(
      "/api/transacciones-pago/:id",
      this.paymentTransactionController.updatePatch.bind(this.paymentTransactionController)
    );
    app.delete(
      "/api/transacciones-pago/:id",
      this.paymentTransactionController.deletePhysical.bind(this.paymentTransactionController)
    );
    app.patch(
      "/api/transacciones-pago/:id/deactivate",
      this.paymentTransactionController.deleteLogical.bind(this.paymentTransactionController)
    );
  }
}
