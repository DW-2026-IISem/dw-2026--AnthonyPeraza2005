import { Application } from "express";
import { authenticate, authorize } from "../../auth/access";
import { PaymentTransactionController } from "./payment-transaction.controller";

export class PaymentTransactionRoutes {
  public paymentTransactionController: PaymentTransactionController = new PaymentTransactionController();

  public routes(app: Application): void {
    app.get(
      "/api/transacciones-pago",
      authenticate, authorize, this.paymentTransactionController.getAll.bind(this.paymentTransactionController)
    );
    app.get(
      "/api/transacciones-pago/:id",
      authenticate, authorize, this.paymentTransactionController.getOne.bind(this.paymentTransactionController)
    );
    app.post(
      "/api/transacciones-pago",
      authenticate, authorize, this.paymentTransactionController.create.bind(this.paymentTransactionController)
    );
    app.put(
      "/api/transacciones-pago/:id",
      authenticate, authorize, this.paymentTransactionController.updatePut.bind(this.paymentTransactionController)
    );
    app.patch(
      "/api/transacciones-pago/:id",
      authenticate, authorize, this.paymentTransactionController.updatePatch.bind(this.paymentTransactionController)
    );
    app.delete(
      "/api/transacciones-pago/:id",
      authenticate, authorize, this.paymentTransactionController.deletePhysical.bind(this.paymentTransactionController)
    );
    app.patch(
      "/api/transacciones-pago/:id/deactivate",
      authenticate, authorize, this.paymentTransactionController.deleteLogical.bind(this.paymentTransactionController)
    );
  }
}
