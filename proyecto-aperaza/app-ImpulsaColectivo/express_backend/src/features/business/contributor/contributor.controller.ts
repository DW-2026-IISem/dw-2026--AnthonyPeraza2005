import { Request, Response } from "express";
import { Contributor, ContributorI } from "./contributor.model";

function paramId(req: Request): number {
  const raw = req.params.id;
  const value = Array.isArray(raw) ? raw[0] : raw;
  return Number(value);
}

export class ContributorController {
  // ================== READ ==================
  public async getAll(req: Request, res: Response) {
    try {
      const contributors = await Contributor.findAll({
        where: { status: "active" },
      });
      res.status(200).json({ contributors });
    } catch (error) {
      res.status(500).json({ error: "Error fetching contributors", detail: String(error) });
    }
  }

  public async getOne(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const contributor = await Contributor.findByPk(id);
      if (!contributor) {
        res.status(404).json({ error: "Contributor not found" });
        return;
      }
      res.status(200).json({ contributor });
    } catch (error) {
      res.status(500).json({ error: "Error fetching contributor", detail: String(error) });
    }
  }

  // ================== CREATE ==================
  public async create(req: Request, res: Response) {
    try {
      const body = req.body as ContributorI;
      const contributor = await Contributor.create({
        name: body.name,
        email: body.email,
        phone: body.phone ?? null,
        status: body.status ?? "active",
      });
      res.status(201).json({ contributor });
    } catch (error) {
      res.status(500).json({ error: "Error creating contributor", detail: String(error) });
    }
  }

  // ================== UPDATE ==================
  public async updatePut(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const body = req.body as ContributorI;
      const contributor = await Contributor.findByPk(id);
      if (!contributor) {
        res.status(404).json({ error: "Contributor not found" });
        return;
      }

      await contributor.update({
        name: body.name,
        email: body.email,
        phone: body.phone ?? null,
        status: body.status ?? contributor.status,
      });

      res.status(200).json({ contributor });
    } catch (error) {
      res.status(500).json({ error: "Error updating contributor (PUT)", detail: String(error) });
    }
  }

  public async updatePatch(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const body = req.body as Partial<ContributorI>;
      const contributor = await Contributor.findByPk(id);
      if (!contributor) {
        res.status(404).json({ error: "Contributor not found" });
        return;
      }

      await contributor.update(body);
      res.status(200).json({ contributor });
    } catch (error) {
      res.status(500).json({ error: "Error updating contributor (PATCH)", detail: String(error) });
    }
  }

  // ================== DELETE ==================
  /** Eliminación física */
  public async deletePhysical(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const contributor = await Contributor.findByPk(id);
      if (!contributor) {
        res.status(404).json({ error: "Contributor not found" });
        return;
      }
      await contributor.destroy();
      res.status(200).json({ message: "Contributor permanently deleted", id });
    } catch (error) {
      res.status(500).json({ error: "Error deleting contributor", detail: String(error) });
    }
  }

  /** Eliminación lógica → status = inactive */
  public async deleteLogical(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const contributor = await Contributor.findByPk(id);
      if (!contributor) {
        res.status(404).json({ error: "Contributor not found" });
        return;
      }
      await contributor.update({ status: "inactive" });
      res.status(200).json({
        message: "Contributor deactivated (logical delete)",
        contributor,
      });
    } catch (error) {
      res.status(500).json({ error: "Error deactivating contributor", detail: String(error) });
    }
  }
}
