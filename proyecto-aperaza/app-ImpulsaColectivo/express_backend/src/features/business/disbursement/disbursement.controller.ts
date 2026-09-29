import { Request, Response } from "express";
import { Disbursement, DisbursementI } from "./disbursement.model";
import { Project } from "../project/project.model";

async function assertActiveProject(
  project_id: number
): Promise<{ ok: true } | { ok: false; status: number; error: string }> {
  const project = await Project.findByPk(project_id);
  if (!project) {
    return { ok: false, status: 404, error: "El project_id indicado no existe" };
  }
  if (project.get("status") !== "active") {
    return { ok: false, status: 400, error: "El proyecto indicado no está activo" };
  }
  return { ok: true };
}

export class DisbursementController {
  public async getAll(req: Request, res: Response) {
    try {
      const disbursements = await Disbursement.findAll();
      return res.status(200).json({ disbursements });
    } catch (error) {
      return res.status(500).json({ error: "Error al obtener los desembolsos" });
    }
  }

  public async getOne(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const disbursement = await Disbursement.findByPk(id as string);
      if (!disbursement) {
        return res.status(404).json({ error: "Desembolso no encontrado" });
      }
      return res.status(200).json({ disbursement });
    } catch (error) {
      return res.status(500).json({ error: "Error al obtener el desembolso" });
    }
  }

  public async create(req: Request, res: Response) {
    try {
      const body = req.body as Pick<
        DisbursementI,
        "amount" | "disbursement_date" | "method" | "project_id" | "status"
      >;

      const projectCheck = await assertActiveProject(body.project_id);
      if (!projectCheck.ok) {
        return res.status(projectCheck.status).json({ error: projectCheck.error });
      }

      const disbursement = await Disbursement.create({
        amount: body.amount,
        disbursement_date: body.disbursement_date,
        method: body.method,
        project_id: body.project_id,
        status: body.status ?? "inactive",
      });

      return res.status(201).json({ disbursement });
    } catch (error) {
      return res.status(500).json({ error: "Error al crear el desembolso" });
    }
  }

  public async updatePut(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const body = req.body as Pick<
        DisbursementI,
        "amount" | "disbursement_date" | "method" | "project_id" | "status"
      >;

      const disbursement = await Disbursement.findByPk(id as string);
      if (!disbursement) {
        return res.status(404).json({ error: "Desembolso no encontrado" });
      }

      const projectCheck = await assertActiveProject(body.project_id);
      if (!projectCheck.ok) {
        return res.status(projectCheck.status).json({ error: projectCheck.error });
      }

      await disbursement.update({
        amount: body.amount,
        disbursement_date: body.disbursement_date,
        method: body.method,
        project_id: body.project_id,
        status: body.status,
      });

      return res.status(200).json({ disbursement });
    } catch (error) {
      return res.status(500).json({ error: "Error al actualizar el desembolso" });
    }
  }

  public async updatePatch(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const body = req.body as Partial<DisbursementI>;

      const disbursement = await Disbursement.findByPk(id as string);
      if (!disbursement) {
        return res.status(404).json({ error: "Desembolso no encontrado" });
      }

      if (body.project_id !== undefined) {
        const projectCheck = await assertActiveProject(body.project_id);
        if (!projectCheck.ok) {
          return res.status(projectCheck.status).json({ error: projectCheck.error });
        }
      }

      await disbursement.update(body);

      return res.status(200).json({ disbursement });
    } catch (error) {
      return res.status(500).json({ error: "Error al actualizar parcialmente el desembolso" });
    }
  }

  public async deletePhysical(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const disbursement = await Disbursement.findByPk(id as string);
      if (!disbursement) {
        return res.status(404).json({ error: "Desembolso no encontrado" });
      }
      await disbursement.destroy();
      return res.status(200).json({ message: "Desembolso eliminado físicamente" });
    } catch (error) {
      return res.status(500).json({ error: "Error al eliminar el desembolso" });
    }
  }

  public async deleteLogical(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const disbursement = await Disbursement.findByPk(id as string);
      if (!disbursement) {
        return res.status(404).json({ error: "Desembolso no encontrado" });
      }
      await disbursement.update({ status: "inactive" });
      return res.status(200).json({ message: "Desembolso desactivado (borrado lógico)" });
    } catch (error) {
      return res.status(500).json({ error: "Error al desactivar el desembolso" });
    }
  }
}
