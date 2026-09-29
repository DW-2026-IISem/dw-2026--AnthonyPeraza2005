import { Request, Response } from "express";
import { Refund, RefundI } from "./refund.model";
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

export class RefundController {
  public async getAll(req: Request, res: Response) {
    try {
      const refunds = await Refund.findAll();
      return res.status(200).json({ refunds });
    } catch (error) {
      return res.status(500).json({ error: "Error al obtener los reembolsos" });
    }
  }

  public async getOne(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const refund = await Refund.findByPk(id as string);
      if (!refund) {
        return res.status(404).json({ error: "Reembolso no encontrado" });
      }
      return res.status(200).json({ refund });
    } catch (error) {
      return res.status(500).json({ error: "Error al obtener el reembolso" });
    }
  }

  public async create(req: Request, res: Response) {
    try {
      const body = req.body as Pick<
        RefundI,
        "amount" | "reason" | "refund_date" | "contribution_id" | "status"
      >;

      const contributionCheck = await assertActiveContribution(body.contribution_id);
      if (!contributionCheck.ok) {
        return res.status(contributionCheck.status).json({ error: contributionCheck.error });
      }

      const refund = await Refund.create({
        amount: body.amount,
        reason: body.reason,
        refund_date: body.refund_date,
        contribution_id: body.contribution_id,
        status: body.status ?? "inactive",
      });

      return res.status(201).json({ refund });
    } catch (error) {
      return res.status(500).json({ error: "Error al crear el reembolso" });
    }
  }

  public async updatePut(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const body = req.body as Pick<
        RefundI,
        "amount" | "reason" | "refund_date" | "contribution_id" | "status"
      >;

      const refund = await Refund.findByPk(id as string);
      if (!refund) {
        return res.status(404).json({ error: "Reembolso no encontrado" });
      }

      const contributionCheck = await assertActiveContribution(body.contribution_id);
      if (!contributionCheck.ok) {
        return res.status(contributionCheck.status).json({ error: contributionCheck.error });
      }

      await refund.update({
        amount: body.amount,
        reason: body.reason,
        refund_date: body.refund_date,
        contribution_id: body.contribution_id,
        status: body.status,
      });

      return res.status(200).json({ refund });
    } catch (error) {
      return res.status(500).json({ error: "Error al actualizar el reembolso" });
    }
  }

  public async updatePatch(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const body = req.body as Partial<RefundI>;

      const refund = await Refund.findByPk(id as string);
      if (!refund) {
        return res.status(404).json({ error: "Reembolso no encontrado" });
      }

      if (body.contribution_id !== undefined) {
        const contributionCheck = await assertActiveContribution(body.contribution_id);
        if (!contributionCheck.ok) {
          return res.status(contributionCheck.status).json({ error: contributionCheck.error });
        }
      }

      await refund.update(body);

      return res.status(200).json({ refund });
    } catch (error) {
      return res.status(500).json({ error: "Error al actualizar parcialmente el reembolso" });
    }
  }

  public async deletePhysical(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const refund = await Refund.findByPk(id as string);
      if (!refund) {
        return res.status(404).json({ error: "Reembolso no encontrado" });
      }
      await refund.destroy();
      return res.status(200).json({ message: "Reembolso eliminado físicamente" });
    } catch (error) {
      return res.status(500).json({ error: "Error al eliminar el reembolso" });
    }
  }

  public async deleteLogical(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const refund = await Refund.findByPk(id as string);
      if (!refund) {
        return res.status(404).json({ error: "Reembolso no encontrado" });
      }
      await refund.update({ status: "inactive" });
      return res.status(200).json({ message: "Reembolso desactivado (borrado lógico)" });
    } catch (error) {
      return res.status(500).json({ error: "Error al desactivar el reembolso" });
    }
  }
}
