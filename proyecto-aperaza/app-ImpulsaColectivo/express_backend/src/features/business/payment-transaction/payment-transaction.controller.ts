import { Request, Response } from "express";
import { BaseController } from "../../../shared/http/base-controller";
import { PaymentTransactionService } from "./payment-transaction.service";

export class PaymentTransactionController extends BaseController {
  public constructor(
    private readonly service: PaymentTransactionService = new PaymentTransactionService()
  ) {
    super();
  }

  public async getAll(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const payment_transactions = await this.service.getAll();
      res.status(200).json({ payment_transactions });
    });
  }

  public async getOne(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const payment_transaction = await this.service.getOne(this.paramId(req));
      res.status(200).json({ payment_transaction });
    });
  }

  public async create(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const payment_transaction = await this.service.create(req.body);
      res.status(201).json({ payment_transaction });
    });
  }

  public async updatePut(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const payment_transaction = await this.service.updatePut(this.paramId(req), req.body);
      res.status(200).json({ payment_transaction });
    });
  }

  public async updatePatch(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const payment_transaction = await this.service.updatePatch(this.paramId(req), req.body);
      res.status(200).json({ payment_transaction });
    });
  }

  public async deletePhysical(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const id = this.paramId(req);
      await this.service.deletePhysical(id);
      res.status(200).json({ message: "Transacción de pago eliminada físicamente", id });
    });
  }

  public async deleteLogical(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const payment_transaction = await this.service.deleteLogical(this.paramId(req));
      res.status(200).json({
        message: "Transacción de pago desactivada (borrado lógico)",
        payment_transaction,
      });
    });
  }
}
