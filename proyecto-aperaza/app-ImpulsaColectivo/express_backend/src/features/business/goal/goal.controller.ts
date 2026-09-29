import { Request, Response } from "express";
import { Goal, GoalI } from "./goal.model";
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

export class GoalController {
  // ================== READ ==================
  public async getAll(req: Request, res: Response) {
    try {
      const goals = await Goal.findAll({
        where: { status: "active" },
      });
      res.status(200).json({ goals });
    } catch (error) {
      res.status(500).json({ error: "Error fetching goals", detail: String(error) });
    }
  }

  public async getOne(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const goal = await Goal.findByPk(id);
      if (!goal) {
        res.status(404).json({ error: "Goal not found" });
        return;
      }
      res.status(200).json({ goal });
    } catch (error) {
      res.status(500).json({ error: "Error fetching goal", detail: String(error) });
    }
  }

  // ================== CREATE ==================
  public async create(req: Request, res: Response) {
    try {
      const body = req.body as GoalI;
      const check = await assertActiveProject(Number(body.project_id));
      if (!check.ok) {
        res.status(check.status).json({ error: check.error });
        return;
      }

      const goal = await Goal.create({
        description: body.description,
        target_amount: body.target_amount,
        project_id: body.project_id,
        status: body.status ?? "active",
      });
      res.status(201).json({ goal });
    } catch (error) {
      res.status(500).json({ error: "Error creating goal", detail: String(error) });
    }
  }

  // ================== UPDATE ==================
  public async updatePut(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const body = req.body as GoalI;
      const goal = await Goal.findByPk(id);
      if (!goal) {
        res.status(404).json({ error: "Goal not found" });
        return;
      }

      const check = await assertActiveProject(Number(body.project_id));
      if (!check.ok) {
        res.status(check.status).json({ error: check.error });
        return;
      }

      await goal.update({
        description: body.description,
        target_amount: body.target_amount,
        project_id: body.project_id,
        status: body.status ?? goal.status,
      });

      res.status(200).json({ goal });
    } catch (error) {
      res.status(500).json({ error: "Error updating goal (PUT)", detail: String(error) });
    }
  }

  public async updatePatch(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const body = req.body as Partial<GoalI>;
      const goal = await Goal.findByPk(id);
      if (!goal) {
        res.status(404).json({ error: "Goal not found" });
        return;
      }

      if (body.project_id !== undefined) {
        const check = await assertActiveProject(Number(body.project_id));
        if (!check.ok) {
          res.status(check.status).json({ error: check.error });
          return;
        }
      }

      await goal.update(body);
      res.status(200).json({ goal });
    } catch (error) {
      res.status(500).json({ error: "Error updating goal (PATCH)", detail: String(error) });
    }
  }

  // ================== DELETE ==================
  /** Eliminación física */
  public async deletePhysical(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const goal = await Goal.findByPk(id);
      if (!goal) {
        res.status(404).json({ error: "Goal not found" });
        return;
      }
      await goal.destroy();
      res.status(200).json({ message: "Goal permanently deleted", id });
    } catch (error) {
      res.status(500).json({ error: "Error deleting goal", detail: String(error) });
    }
  }

  /** Eliminación lógica → status = inactive */
  public async deleteLogical(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const goal = await Goal.findByPk(id);
      if (!goal) {
        res.status(404).json({ error: "Goal not found" });
        return;
      }
      await goal.update({ status: "inactive" });
      res.status(200).json({
        message: "Goal deactivated (logical delete)",
        goal,
      });
    } catch (error) {
      res.status(500).json({ error: "Error deactivating goal", detail: String(error) });
    }
  }
}
