import { Request, Response } from "express";
import { BaseController } from "../../../shared/http/base-controller";
import { ContributionService } from "./contribution.service";

export class ContributionController extends BaseController {
  public constructor(
    private readonly service: ContributionService = new ContributionService()
  ) {
    super();
  }

  public async getAll(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const contributions = await this.service.getAll();
      res.status(200).json({ contributions });
    });
  }

  public async getOne(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const contribution = await this.service.getOne(this.paramId(req));
      res.status(200).json({ contribution });
    });
  }

  public async create(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const contribution = await this.service.create(req.body);
      res.status(201).json({ contribution });
    });
  }

  public async updatePut(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const contribution = await this.service.updatePut(this.paramId(req), req.body);
      res.status(200).json({ contribution });
    });
  }

  public async updatePatch(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const contribution = await this.service.updatePatch(this.paramId(req), req.body);
      res.status(200).json({ contribution });
    });
  }

  public async deletePhysical(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const id = this.paramId(req);
      await this.service.deletePhysical(id);
      res.status(200).json({ message: "Contribution eliminada físicamente", id });
    });
  }

  public async deleteLogical(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const contribution = await this.service.deleteLogical(this.paramId(req));
      res.status(200).json({ message: "Contribution desactivada (borrado lógico)", contribution });
    });
  }
}
