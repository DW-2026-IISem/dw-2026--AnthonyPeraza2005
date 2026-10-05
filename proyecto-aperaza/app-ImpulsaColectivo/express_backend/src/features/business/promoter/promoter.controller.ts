import { Request, Response } from "express";
import { BaseController } from "../../../shared/http/base-controller";
import { PromoterService } from "./promoter.service";

export class PromoterController extends BaseController {
  public constructor(
    private readonly service: PromoterService = new PromoterService()
  ) {
    super();
  }

  public async getAll(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const promoters = await this.service.getAll();
      res.status(200).json({ promoters });
    });
  }

  public async getOne(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const promoter = await this.service.getOne(this.paramId(req));
      res.status(200).json({ promoter });
    });
  }

  public async create(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const promoter = await this.service.create(req.body);
      res.status(201).json({ promoter });
    });
  }

  public async updatePut(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const promoter = await this.service.updatePut(this.paramId(req), req.body);
      res.status(200).json({ promoter });
    });
  }

  public async updatePatch(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const promoter = await this.service.updatePatch(this.paramId(req), req.body);
      res.status(200).json({ promoter });
    });
  }

  public async deletePhysical(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const id = this.paramId(req);
      await this.service.deletePhysical(id);
      res.status(200).json({ message: "Promoter eliminado físicamente", id });
    });
  }

  public async deleteLogical(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const promoter = await this.service.deleteLogical(this.paramId(req));
      res.status(200).json({ message: "Promoter desactivado (borrado lógico)", promoter });
    });
  }
}
