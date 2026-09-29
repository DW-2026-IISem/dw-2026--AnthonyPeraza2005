import { Request, Response } from "express";
import { ProjectAudit, ProjectAuditI } from "./project-audit.model";
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

export class ProjectAuditController {
  public async getAll(req: Request, res: Response) {
    try {
      const project_audits = await ProjectAudit.findAll();
      return res.status(200).json({ project_audits });
    } catch (error) {
      return res.status(500).json({ error: "Error al obtener las auditorías de proyecto" });
    }
  }

  public async getOne(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const project_audit = await ProjectAudit.findByPk(id as string);
      if (!project_audit) {
        return res.status(404).json({ error: "Auditoría de proyecto no encontrada" });
      }
      return res.status(200).json({ project_audit });
    } catch (error) {
      return res.status(500).json({ error: "Error al obtener la auditoría de proyecto" });
    }
  }

  public async create(req: Request, res: Response) {
    try {
      const body = req.body as Pick<
        ProjectAuditI,
        "action" | "detail" | "audit_date" | "project_id" | "status"
      >;

      const projectCheck = await assertActiveProject(body.project_id);
      if (!projectCheck.ok) {
        return res.status(projectCheck.status).json({ error: projectCheck.error });
      }

      const project_audit = await ProjectAudit.create({
        action: body.action,
        detail: body.detail,
        audit_date: body.audit_date,
        project_id: body.project_id,
        status: body.status ?? "inactive",
      });

      return res.status(201).json({ project_audit });
    } catch (error) {
      return res.status(500).json({ error: "Error al crear la auditoría de proyecto" });
    }
  }

  public async updatePut(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const body = req.body as Pick<
        ProjectAuditI,
        "action" | "detail" | "audit_date" | "project_id" | "status"
      >;

      const project_audit = await ProjectAudit.findByPk(id as string);
      if (!project_audit) {
        return res.status(404).json({ error: "Auditoría de proyecto no encontrada" });
      }

      const projectCheck = await assertActiveProject(body.project_id);
      if (!projectCheck.ok) {
        return res.status(projectCheck.status).json({ error: projectCheck.error });
      }

      await project_audit.update({
        action: body.action,
        detail: body.detail,
        audit_date: body.audit_date,
        project_id: body.project_id,
        status: body.status,
      });

      return res.status(200).json({ project_audit });
    } catch (error) {
      return res.status(500).json({ error: "Error al actualizar la auditoría de proyecto" });
    }
  }

  public async updatePatch(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const body = req.body as Partial<ProjectAuditI>;

      const project_audit = await ProjectAudit.findByPk(id as string);
      if (!project_audit) {
        return res.status(404).json({ error: "Auditoría de proyecto no encontrada" });
      }

      if (body.project_id !== undefined) {
        const projectCheck = await assertActiveProject(body.project_id);
        if (!projectCheck.ok) {
          return res.status(projectCheck.status).json({ error: projectCheck.error });
        }
      }

      await project_audit.update(body);

      return res.status(200).json({ project_audit });
    } catch (error) {
      return res.status(500).json({ error: "Error al actualizar parcialmente la auditoría de proyecto" });
    }
  }

  public async deletePhysical(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const project_audit = await ProjectAudit.findByPk(id as string);
      if (!project_audit) {
        return res.status(404).json({ error: "Auditoría de proyecto no encontrada" });
      }
      await project_audit.destroy();
      return res.status(200).json({ message: "Auditoría de proyecto eliminada físicamente" });
    } catch (error) {
      return res.status(500).json({ error: "Error al eliminar la auditoría de proyecto" });
    }
  }

  public async deleteLogical(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const project_audit = await ProjectAudit.findByPk(id as string);
      if (!project_audit) {
        return res.status(404).json({ error: "Auditoría de proyecto no encontrada" });
      }
      await project_audit.update({ status: "inactive" });
      return res.status(200).json({ message: "Auditoría de proyecto desactivada (borrado lógico)" });
    } catch (error) {
      return res.status(500).json({ error: "Error al desactivar la auditoría de proyecto" });
    }
  }
}
