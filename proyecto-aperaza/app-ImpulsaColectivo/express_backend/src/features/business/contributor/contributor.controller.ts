import { Request, Response } from "express";
import { BaseController } from "../../../shared/http/base-controller";
import { ContributorService } from "./contributor.service";

export class ContributorController extends BaseController {
  public constructor(
    private readonly service: ContributorService = new ContributorService()
  ) {
    super();
  }

  public async getAll(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const contributors = await this.service.getAll();
      res.status(200).json({ contributors });
    });
  }

  public async getOne(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const contributor = await this.service.getOne(this.paramId(req));
      res.status(200).json({ contributor });
    });
  }

  public async create(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const contributor = await this.service.create(req.body);
      res.status(201).json({ contributor });
    });
  }

  public async updatePut(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const contributor = await this.service.updatePut(this.paramId(req), req.body);
      res.status(200).json({ contributor });
    });
  }

  public async updatePatch(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const contributor = await this.service.updatePatch(this.paramId(req), req.body);
      res.status(200).json({ contributor });
    });
  }

  public async deletePhysical(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const id = this.paramId(req);
      await this.service.deletePhysical(id);
      res.status(200).json({ message: "Contributor eliminado físicamente", id });
    });
  }

  public async deleteLogical(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const contributor = await this.service.deleteLogical(this.paramId(req));
      res.status(200).json({ message: "Contributor desactivado (borrado lógico)", contributor });
    });
  }
}
