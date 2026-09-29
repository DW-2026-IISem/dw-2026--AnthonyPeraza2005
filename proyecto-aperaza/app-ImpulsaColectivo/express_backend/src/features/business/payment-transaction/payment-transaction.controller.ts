import { Request, Response } from "express";
import { PaymentTransaction, PaymentTransactionI } from "./payment-transaction.model";
import { Contribution } from "../contribution/contribution.model";

async function assertActiveContribution(
  contribution_id: number
): Promise<{ ok: true } | { ok: false; status: number; error: string }> {
  const contribution = await Contribution.findByPk(contribution_id);
  if (!contribution) {
    return { ok: false, status: 404, error: "El contribution_id indicado no existe" };
  }
  if (contribution.get("status") !== "active") {
    return { ok: false, status: 400, error: "La contribución indicada no está activa" };
  }
  return { ok: true };
}

export class PaymentTransactionController {
  public async getAll(req: Request, res: Response) {
    try {
      const payment_transactions = await PaymentTransaction.findAll();
      return res.status(200).json({ payment_transactions });
    } catch (error) {
      return res.status(500).json({ error: "Error al obtener las transacciones de pago" });
    }
  }

  public async getOne(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const payment_transaction = await PaymentTransaction.findByPk(id as string);
      if (!payment_transaction) {
        return res.status(404).json({ error: "Transacción de pago no encontrada" });
      }
      return res.status(200).json({ payment_transaction });
    } catch (error) {
      return res.status(500).json({ error: "Error al obtener la transacción de pago" });
    }
  }

  public async create(req: Request, res: Response) {
    try {
      const body = req.body as Pick<
        PaymentTransactionI,
        "reference" | "payment_method" | "amount" | "transaction_date" | "contribution_id" | "status"
      >;

      const contributionCheck = await assertActiveContribution(body.contribution_id);
      if (!contributionCheck.ok) {
        return res.status(contributionCheck.status).json({ error: contributionCheck.error });
      }

      const payment_transaction = await PaymentTransaction.create({
        reference: body.reference,
        payment_method: body.payment_method,
        amount: body.amount,
        transaction_date: body.transaction_date,
        contribution_id: body.contribution_id,
        status: body.status ?? "inactive",
      });

      return res.status(201).json({ payment_transaction });
    } catch (error) {
      return res.status(500).json({ error: "Error al crear la transacción de pago" });
    }
  }

  public async updatePut(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const body = req.body as Pick<
        PaymentTransactionI,
        "reference" | "payment_method" | "amount" | "transaction_date" | "contribution_id" | "status"
      >;

      const payment_transaction = await PaymentTransaction.findByPk(id as string);
      if (!payment_transaction) {
        return res.status(404).json({ error: "Transacción de pago no encontrada" });
      }

      const contributionCheck = await assertActiveContribution(body.contribution_id);
      if (!contributionCheck.ok) {
        return res.status(contributionCheck.status).json({ error: contributionCheck.error });
      }

      await payment_transaction.update({
        reference: body.reference,
        payment_method: body.payment_method,
        amount: body.amount,
        transaction_date: body.transaction_date,
        contribution_id: body.contribution_id,
        status: body.status,
      });

      return res.status(200).json({ payment_transaction });
    } catch (error) {
      return res.status(500).json({ error: "Error al actualizar la transacción de pago" });
    }
  }

  public async updatePatch(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const body = req.body as Partial<PaymentTransactionI>;

      const payment_transaction = await PaymentTransaction.findByPk(id as string);
      if (!payment_transaction) {
        return res.status(404).json({ error: "Transacción de pago no encontrada" });
      }

      if (body.contribution_id !== undefined) {
        const contributionCheck = await assertActiveContribution(body.contribution_id);
        if (!contributionCheck.ok) {
          return res.status(contributionCheck.status).json({ error: contributionCheck.error });
        }
      }

      await payment_transaction.update(body);

      return res.status(200).json({ payment_transaction });
    } catch (error) {
      return res.status(500).json({ error: "Error al actualizar parcialmente la transacción de pago" });
    }
  }

  public async deletePhysical(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const payment_transaction = await PaymentTransaction.findByPk(id as string);
      if (!payment_transaction) {
        return res.status(404).json({ error: "Transacción de pago no encontrada" });
      }
      await payment_transaction.destroy();
      return res.status(200).json({ message: "Transacción de pago eliminada físicamente" });
    } catch (error) {
      return res.status(500).json({ error: "Error al eliminar la transacción de pago" });
    }
  }

  public async deleteLogical(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const payment_transaction = await PaymentTransaction.findByPk(id as string);
      if (!payment_transaction) {
        return res.status(404).json({ error: "Transacción de pago no encontrada" });
      }
      await payment_transaction.update({ status: "inactive" });
      return res.status(200).json({ message: "Transacción de pago desactivada (borrado lógico)" });
    } catch (error) {
      return res.status(500).json({ error: "Error al desactivar la transacción de pago" });
    }
  }
}
