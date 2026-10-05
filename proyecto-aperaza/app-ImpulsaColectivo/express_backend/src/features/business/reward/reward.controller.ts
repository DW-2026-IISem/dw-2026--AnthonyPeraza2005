import { Request, Response } from "express";
import { BaseController } from "../../../shared/http/base-controller";
import { RewardService } from "./reward.service";

export class RewardController extends BaseController {
  public constructor(
    private readonly service: RewardService = new RewardService()
  ) {
    super();
  }

  public async getAll(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const rewards = await this.service.getAll();
      res.status(200).json({ rewards });
    });
  }

  public async getOne(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const reward = await this.service.getOne(this.paramId(req));
      res.status(200).json({ reward });
    });
  }

  public async create(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const reward = await this.service.create(req.body);
      res.status(201).json({ reward });
    });
  }

  public async updatePut(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const reward = await this.service.updatePut(this.paramId(req), req.body);
      res.status(200).json({ reward });
    });
  }

  public async updatePatch(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const reward = await this.service.updatePatch(this.paramId(req), req.body);
      res.status(200).json({ reward });
    });
  }

  public async deletePhysical(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const id = this.paramId(req);
      await this.service.deletePhysical(id);
      res.status(200).json({ message: "Reward eliminada físicamente", id });
    });
  }

  public async deleteLogical(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const reward = await this.service.deleteLogical(this.paramId(req));
      res.status(200).json({ message: "Reward desactivada (borrado lógico)", reward });
    });
  }
}
