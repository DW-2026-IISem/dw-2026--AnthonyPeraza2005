import { Request, Response } from "express";
import { Commission, CommissionI } from "./commission.model";
import { PaymentTransaction } from "../payment-transaction/payment-transaction.model";

async function assertActivePaymentTransaction(
  payment_transaction_id: number
): Promise<{ ok: true } | { ok: false; status: number; error: string }> {
  const payment_transaction = await PaymentTransaction.findByPk(payment_transaction_id);
  if (!payment_transaction) {
    return { ok: false, status: 404, error: "El payment_transaction_id indicado no existe" };
  }
  if (payment_transaction.get("status") !== "active") {
    return { ok: false, status: 400, error: "La transacción de pago indicada no está activa" };
  }
  return { ok: true };
}

export class CommissionController {
  public async getAll(req: Request, res: Response) {
    try {
      const commissions = await Commission.findAll();
      return res.status(200).json({ commissions });
    } catch (error) {
      return res.status(500).json({ error: "Error al obtener las comisiones" });
    }
  }

  public async getOne(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const commission = await Commission.findByPk(id as string);
      if (!commission) {
        return res.status(404).json({ error: "Comisión no encontrada" });
      }
      return res.status(200).json({ commission });
    } catch (error) {
      return res.status(500).json({ error: "Error al obtener la comisión" });
    }
  }

  public async create(req: Request, res: Response) {
    try {
      const body = req.body as Pick<
        CommissionI,
        "percentage" | "amount" | "calculation_date" | "payment_transaction_id" | "status"
      >;

      const paymentTransactionCheck = await assertActivePaymentTransaction(body.payment_transaction_id);
      if (!paymentTransactionCheck.ok) {
        return res.status(paymentTransactionCheck.status).json({ error: paymentTransactionCheck.error });
      }

      const commission = await Commission.create({
        percentage: body.percentage,
        amount: body.amount,
        calculation_date: body.calculation_date,
        payment_transaction_id: body.payment_transaction_id,
        status: body.status ?? "inactive",
      });

      return res.status(201).json({ commission });
    } catch (error) {
      return res.status(500).json({ error: "Error al crear la comisión" });
    }
  }

  public async updatePut(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const body = req.body as Pick<
        CommissionI,
        "percentage" | "amount" | "calculation_date" | "payment_transaction_id" | "status"
      >;

      const commission = await Commission.findByPk(id as string);
      if (!commission) {
        return res.status(404).json({ error: "Comisión no encontrada" });
      }

      const paymentTransactionCheck = await assertActivePaymentTransaction(body.payment_transaction_id);
      if (!paymentTransactionCheck.ok) {
        return res.status(paymentTransactionCheck.status).json({ error: paymentTransactionCheck.error });
      }

      await commission.update({
        percentage: body.percentage,
        amount: body.amount,
        calculation_date: body.calculation_date,
        payment_transaction_id: body.payment_transaction_id,
        status: body.status,
      });

      return res.status(200).json({ commission });
    } catch (error) {
      return res.status(500).json({ error: "Error al actualizar la comisión" });
    }
  }

  public async updatePatch(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const body = req.body as Partial<CommissionI>;

      const commission = await Commission.findByPk(id as string);
      if (!commission) {
        return res.status(404).json({ error: "Comisión no encontrada" });
      }

      if (body.payment_transaction_id !== undefined) {
        const paymentTransactionCheck = await assertActivePaymentTransaction(body.payment_transaction_id);
        if (!paymentTransactionCheck.ok) {
          return res.status(paymentTransactionCheck.status).json({ error: paymentTransactionCheck.error });
        }
      }

      await commission.update(body);

      return res.status(200).json({ commission });
    } catch (error) {
      return res.status(500).json({ error: "Error al actualizar parcialmente la comisión" });
    }
  }

  public async deletePhysical(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const commission = await Commission.findByPk(id as string);
      if (!commission) {
        return res.status(404).json({ error: "Comisión no encontrada" });
      }
      await commission.destroy();
      return res.status(200).json({ message: "Comisión eliminada físicamente" });
    } catch (error) {
      return res.status(500).json({ error: "Error al eliminar la comisión" });
    }
  }

  public async deleteLogical(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const commission = await Commission.findByPk(id as string);
      if (!commission) {
        return res.status(404).json({ error: "Comisión no encontrada" });
      }
      await commission.update({ status: "inactive" });
      return res.status(200).json({ message: "Comisión desactivada (borrado lógico)" });
    } catch (error) {
      return res.status(500).json({ error: "Error al desactivar la comisión" });
    }
  }
}
