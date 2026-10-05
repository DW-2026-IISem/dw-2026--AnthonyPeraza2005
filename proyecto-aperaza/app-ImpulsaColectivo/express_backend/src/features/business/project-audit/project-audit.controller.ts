import { Request, Response } from "express";
import { BaseController } from "../../../shared/http/base-controller";
import { ProjectAuditService } from "./project-audit.service";
import { toProjectAuditResponse } from "./dto";

export class ProjectAuditController extends BaseController {
  constructor(private readonly service: ProjectAuditService = new ProjectAuditService()) {
    super();
  }

  async getAll(_req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const projectAudits = await this.service.getAll();
      res.status(200).json({ project_audits: projectAudits.map(toProjectAuditResponse) });
    });
  }

  async getOne(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const projectAudit = await this.service.getOne(this.paramId(req));
      res.status(200).json({ project_audit: toProjectAuditResponse(projectAudit) });
    });
  }

  async create(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const projectAudit = await this.service.create(req.body);
      res.status(201).json({ project_audit: toProjectAuditResponse(projectAudit) });
    });
  }

  async updatePut(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const projectAudit = await this.service.updatePut(this.paramId(req), req.body);
      res.status(200).json({ project_audit: toProjectAuditResponse(projectAudit) });
    });
  }

  async updatePatch(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const projectAudit = await this.service.updatePatch(this.paramId(req), req.body);
      res.status(200).json({ project_audit: toProjectAuditResponse(projectAudit) });
    });
  }

  async deletePhysical(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      await this.service.deletePhysical(this.paramId(req));
      res.status(200).json({ message: "ProjectAudit eliminada físicamente" });
    });
  }

  async deleteLogical(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      await this.service.deleteLogical(this.paramId(req));
      res.status(200).json({ message: "ProjectAudit desactivada (borrado lógico)" });
    });
  }
}
