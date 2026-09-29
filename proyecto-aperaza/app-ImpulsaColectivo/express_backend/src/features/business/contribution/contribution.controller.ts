import { Request, Response } from "express";
import { Contribution, ContributionI } from "./contribution.model";
import { Project } from "../project/project.model";
import { Contributor } from "../contributor/contributor.model";

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

async function assertActiveContributor(
  contributor_id: number
): Promise<{ ok: true } | { ok: false; status: number; error: string }> {
  const contributor = await Contributor.findByPk(contributor_id);
  if (!contributor) {
    return { ok: false, status: 404, error: "El contributor_id indicado no existe" };
  }
  if (contributor.get("status") !== "active") {
    return { ok: false, status: 400, error: "El contribuyente indicado no está activo" };
  }
  return { ok: true };
}

export class ContributionController {
  public async getAll(req: Request, res: Response) {
    try {
      const contributions = await Contribution.findAll();
      return res.status(200).json({ contributions });
    } catch (error) {
      return res.status(500).json({ error: "Error al obtener las contribuciones" });
    }
  }

  public async getOne(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const contribution = await Contribution.findByPk(id as string);
      if (!contribution) {
        return res.status(404).json({ error: "Contribución no encontrada" });
      }
      return res.status(200).json({ contribution });
    } catch (error) {
      return res.status(500).json({ error: "Error al obtener la contribución" });
    }
  }

  public async create(req: Request, res: Response) {
    try {
      const body = req.body as Pick<
        ContributionI,
        "amount" | "contribution_date" | "project_id" | "contributor_id" | "status"
      >;

      const projectCheck = await assertActiveProject(body.project_id);
      if (!projectCheck.ok) {
        return res.status(projectCheck.status).json({ error: projectCheck.error });
      }

      const contributorCheck = await assertActiveContributor(body.contributor_id);
      if (!contributorCheck.ok) {
        return res.status(contributorCheck.status).json({ error: contributorCheck.error });
      }

      const contribution = await Contribution.create({
        amount: body.amount,
        contribution_date: body.contribution_date,
        project_id: body.project_id,
        contributor_id: body.contributor_id,
        status: body.status ?? "inactive",
      });

      return res.status(201).json({ contribution });
    } catch (error) {
      return res.status(500).json({ error: "Error al crear la contribución" });
    }
  }

  public async updatePut(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const body = req.body as Pick<
        ContributionI,
        "amount" | "contribution_date" | "project_id" | "contributor_id" | "status"
      >;

      const contribution = await Contribution.findByPk(id as string);
      if (!contribution) {
        return res.status(404).json({ error: "Contribución no encontrada" });
      }

      const projectCheck = await assertActiveProject(body.project_id);
      if (!projectCheck.ok) {
        return res.status(projectCheck.status).json({ error: projectCheck.error });
      }

      const contributorCheck = await assertActiveContributor(body.contributor_id);
      if (!contributorCheck.ok) {
        return res.status(contributorCheck.status).json({ error: contributorCheck.error });
      }

      await contribution.update({
        amount: body.amount,
        contribution_date: body.contribution_date,
        project_id: body.project_id,
        contributor_id: body.contributor_id,
        status: body.status,
      });

      return res.status(200).json({ contribution });
    } catch (error) {
      return res.status(500).json({ error: "Error al actualizar la contribución" });
    }
  }

  public async updatePatch(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const body = req.body as Partial<ContributionI>;

      const contribution = await Contribution.findByPk(id as string);
      if (!contribution) {
        return res.status(404).json({ error: "Contribución no encontrada" });
      }

      if (body.project_id !== undefined) {
        const projectCheck = await assertActiveProject(body.project_id);
        if (!projectCheck.ok) {
          return res.status(projectCheck.status).json({ error: projectCheck.error });
        }
      }

      if (body.contributor_id !== undefined) {
        const contributorCheck = await assertActiveContributor(body.contributor_id);
        if (!contributorCheck.ok) {
          return res.status(contributorCheck.status).json({ error: contributorCheck.error });
        }
      }

      await contribution.update(body);

      return res.status(200).json({ contribution });
    } catch (error) {
      return res.status(500).json({ error: "Error al actualizar parcialmente la contribución" });
    }
  }

  public async deletePhysical(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const contribution = await Contribution.findByPk(id as string);
      if (!contribution) {
        return res.status(404).json({ error: "Contribución no encontrada" });
      }
      await contribution.destroy();
      return res.status(200).json({ message: "Contribución eliminada físicamente" });
    } catch (error) {
      return res.status(500).json({ error: "Error al eliminar la contribución" });
    }
  }

  public async deleteLogical(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const contribution = await Contribution.findByPk(id as string);
      if (!contribution) {
        return res.status(404).json({ error: "Contribución no encontrada" });
      }
      await contribution.update({ status: "inactive" });
      return res.status(200).json({ message: "Contribución desactivada (borrado lógico)" });
    } catch (error) {
      return res.status(500).json({ error: "Error al desactivar la contribución" });
    }
  }
}
