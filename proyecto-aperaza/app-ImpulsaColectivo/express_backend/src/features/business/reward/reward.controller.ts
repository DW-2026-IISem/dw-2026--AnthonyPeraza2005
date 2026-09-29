import { Request, Response } from "express";
import { Reward, RewardI } from "./reward.model";
import { Project } from "../project/project.model";

function paramId(req: Request): number {
  const raw = req.params.id;
  const value = Array.isArray(raw) ? raw[0] : raw;
  return Number(value);
}

async function assertActiveProject(project_id: number): Promise<{ ok: true } | { ok: false; status: number; error: string }> {
  const project = await Project.findByPk(project_id);
  if (!project) {
    return { ok: false, status: 404, error: "Project not found" };
  }
  if (project.status !== "active") {
    return { ok: false, status: 400, error: "Project must be active" };
  }
  return { ok: true };
}

export class RewardController {
  // ================== READ ==================
  public async getAll(req: Request, res: Response) {
    try {
      const rewards = await Reward.findAll({
        where: { status: "active" },
      });
      res.status(200).json({ rewards });
    } catch (error) {
      res.status(500).json({ error: "Error fetching rewards", detail: String(error) });
    }
  }

  public async getOne(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const reward = await Reward.findByPk(id);
      if (!reward) {
        res.status(404).json({ error: "Reward not found" });
        return;
      }
      res.status(200).json({ reward });
    } catch (error) {
      res.status(500).json({ error: "Error fetching reward", detail: String(error) });
    }
  }

  // ================== CREATE ==================
  public async create(req: Request, res: Response) {
    try {
      const body = req.body as RewardI;
      const check = await assertActiveProject(Number(body.project_id));
      if (!check.ok) {
        res.status(check.status).json({ error: check.error });
        return;
      }

      const reward = await Reward.create({
        title: body.title,
        description: body.description,
        min_amount: body.min_amount,
        project_id: body.project_id,
        status: body.status ?? "active",
      });
      res.status(201).json({ reward });
    } catch (error) {
      res.status(500).json({ error: "Error creating reward", detail: String(error) });
    }
  }

  // ================== UPDATE ==================
  public async updatePut(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const body = req.body as RewardI;
      const reward = await Reward.findByPk(id);
      if (!reward) {
        res.status(404).json({ error: "Reward not found" });
        return;
      }

      const check = await assertActiveProject(Number(body.project_id));
      if (!check.ok) {
        res.status(check.status).json({ error: check.error });
        return;
      }

      await reward.update({
        title: body.title,
        description: body.description,
        min_amount: body.min_amount,
        project_id: body.project_id,
        status: body.status ?? reward.status,
      });

      res.status(200).json({ reward });
    } catch (error) {
      res.status(500).json({ error: "Error updating reward (PUT)", detail: String(error) });
    }
  }

  public async updatePatch(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const body = req.body as Partial<RewardI>;
      const reward = await Reward.findByPk(id);
      if (!reward) {
        res.status(404).json({ error: "Reward not found" });
        return;
      }

      if (body.project_id !== undefined) {
        const check = await assertActiveProject(Number(body.project_id));
        if (!check.ok) {
          res.status(check.status).json({ error: check.error });
          return;
        }
      }

      await reward.update(body);
      res.status(200).json({ reward });
    } catch (error) {
      res.status(500).json({ error: "Error updating reward (PATCH)", detail: String(error) });
    }
  }

  // ================== DELETE ==================
  /** Eliminación física */
  public async deletePhysical(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const reward = await Reward.findByPk(id);
      if (!reward) {
        res.status(404).json({ error: "Reward not found" });
        return;
      }
      await reward.destroy();
      res.status(200).json({ message: "Reward permanently deleted", id });
    } catch (error) {
      res.status(500).json({ error: "Error deleting reward", detail: String(error) });
    }
  }

  /** Eliminación lógica → status = inactive */
  public async deleteLogical(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const reward = await Reward.findByPk(id);
      if (!reward) {
        res.status(404).json({ error: "Reward not found" });
        return;
      }
      await reward.update({ status: "inactive" });
      res.status(200).json({
        message: "Reward deactivated (logical delete)",
        reward,
      });
    } catch (error) {
      res.status(500).json({ error: "Error deactivating reward", detail: String(error) });
    }
  }
}
