import { Request, Response } from "express";
import { Project, ProjectI } from "./project.model";
import { Promoter } from "../promoter/promoter.model";

function paramId(req: Request): number {
  const raw = req.params.id;
  const value = Array.isArray(raw) ? raw[0] : raw;
  return Number(value);
}

async function assertActivePromoter(promoter_id: number): Promise<{ ok: true } | { ok: false; status: number; error: string }> {
  const promoter = await Promoter.findByPk(promoter_id);
  if (!promoter) {
    return { ok: false, status: 404, error: "Promoter not found" };
  }
  if (promoter.status !== "active") {
    return { ok: false, status: 400, error: "Promoter must be active" };
  }
  return { ok: true };
}

export class ProjectController {
  // ================== READ ==================
  public async getAll(req: Request, res: Response) {
    try {
      const projects = await Project.findAll({
        where: { status: "active" },
      });
      res.status(200).json({ projects });
    } catch (error) {
      res.status(500).json({ error: "Error fetching projects", detail: String(error) });
    }
  }

  public async getOne(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const project = await Project.findByPk(id);
      if (!project) {
        res.status(404).json({ error: "Project not found" });
        return;
      }
      res.status(200).json({ project });
    } catch (error) {
      res.status(500).json({ error: "Error fetching project", detail: String(error) });
    }
  }

  // ================== CREATE ==================
  public async create(req: Request, res: Response) {
    try {
      const body = req.body as ProjectI;
      const check = await assertActivePromoter(Number(body.promoter_id));
      if (!check.ok) {
        res.status(check.status).json({ error: check.error });
        return;
      }

      const project = await Project.create({
        title: body.title,
        description: body.description,
        start_date: body.start_date,
        end_date: body.end_date,
        promoter_id: body.promoter_id,
        status: body.status ?? "active",
      });
      res.status(201).json({ project });
    } catch (error) {
      res.status(500).json({ error: "Error creating project", detail: String(error) });
    }
  }

  // ================== UPDATE ==================
  public async updatePut(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const body = req.body as ProjectI;
      const project = await Project.findByPk(id);
      if (!project) {
        res.status(404).json({ error: "Project not found" });
        return;
      }

      const check = await assertActivePromoter(Number(body.promoter_id));
      if (!check.ok) {
        res.status(check.status).json({ error: check.error });
        return;
      }

      await project.update({
        title: body.title,
        description: body.description,
        start_date: body.start_date,
        end_date: body.end_date,
        promoter_id: body.promoter_id,
        status: body.status ?? project.status,
      });

      res.status(200).json({ project });
    } catch (error) {
      res.status(500).json({ error: "Error updating project (PUT)", detail: String(error) });
    }
  }

  public async updatePatch(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const body = req.body as Partial<ProjectI>;
      const project = await Project.findByPk(id);
      if (!project) {
        res.status(404).json({ error: "Project not found" });
        return;
      }

      if (body.promoter_id !== undefined) {
        const check = await assertActivePromoter(Number(body.promoter_id));
        if (!check.ok) {
          res.status(check.status).json({ error: check.error });
          return;
        }
      }

      await project.update(body);
      res.status(200).json({ project });
    } catch (error) {
      res.status(500).json({ error: "Error updating project (PATCH)", detail: String(error) });
    }
  }

  // ================== DELETE ==================
  /** Eliminación física */
  public async deletePhysical(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const project = await Project.findByPk(id);
      if (!project) {
        res.status(404).json({ error: "Project not found" });
        return;
      }
      await project.destroy();
      res.status(200).json({ message: "Project permanently deleted", id });
    } catch (error) {
      res.status(500).json({ error: "Error deleting project", detail: String(error) });
    }
  }

  /** Eliminación lógica → status = inactive */
  public async deleteLogical(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const project = await Project.findByPk(id);
      if (!project) {
        res.status(404).json({ error: "Project not found" });
        return;
      }
      await project.update({ status: "inactive" });
      res.status(200).json({
        message: "Project deactivated (logical delete)",
        project,
      });
    } catch (error) {
      res.status(500).json({ error: "Error deactivating project", detail: String(error) });
    }
  }
}
