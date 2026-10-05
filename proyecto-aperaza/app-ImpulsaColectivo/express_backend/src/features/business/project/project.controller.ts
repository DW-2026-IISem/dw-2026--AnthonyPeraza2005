import { Request, Response } from "express";
import { BaseController } from "../../../shared/http/base-controller";
import { ProjectService } from "./project.service";

export class ProjectController extends BaseController {
  public constructor(
    private readonly service: ProjectService = new ProjectService()
  ) {
    super();
  }

  public async getAll(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const projects = await this.service.getAll();
      res.status(200).json({ projects });
    });
  }

  public async getOne(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const project = await this.service.getOne(this.paramId(req));
      res.status(200).json({ project });
    });
  }

  public async create(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const project = await this.service.create(req.body);
      res.status(201).json({ project });
    });
  }

  public async updatePut(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const project = await this.service.updatePut(this.paramId(req), req.body);
      res.status(200).json({ project });
    });
  }

  public async updatePatch(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const project = await this.service.updatePatch(this.paramId(req), req.body);
      res.status(200).json({ project });
    });
  }

  public async deletePhysical(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const id = this.paramId(req);
      await this.service.deletePhysical(id);
      res.status(200).json({ message: "Project eliminado físicamente", id });
    });
  }

  public async deleteLogical(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const project = await this.service.deleteLogical(this.paramId(req));
      res.status(200).json({ message: "Project desactivado (borrado lógico)", project });
    });
  }
}
