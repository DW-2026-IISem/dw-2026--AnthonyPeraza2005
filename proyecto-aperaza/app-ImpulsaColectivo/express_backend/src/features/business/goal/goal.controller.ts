import { Request, Response } from "express";
import { BaseController } from "../../../shared/http/base-controller";
import { GoalService } from "./goal.service";

export class GoalController extends BaseController {
  public constructor(
    private readonly service: GoalService = new GoalService()
  ) {
    super();
  }

  public async getAll(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const goals = await this.service.getAll();
      res.status(200).json({ goals });
    });
  }

  public async getOne(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const goal = await this.service.getOne(this.paramId(req));
      res.status(200).json({ goal });
    });
  }

  public async create(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const goal = await this.service.create(req.body);
      res.status(201).json({ goal });
    });
  }

  public async updatePut(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const goal = await this.service.updatePut(this.paramId(req), req.body);
      res.status(200).json({ goal });
    });
  }

  public async updatePatch(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const goal = await this.service.updatePatch(this.paramId(req), req.body);
      res.status(200).json({ goal });
    });
  }

  public async deletePhysical(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const id = this.paramId(req);
      await this.service.deletePhysical(id);
      res.status(200).json({ message: "Goal eliminada físicamente", id });
    });
  }

  public async deleteLogical(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const goal = await this.service.deleteLogical(this.paramId(req));
      res.status(200).json({ message: "Goal desactivada (borrado lógico)", goal });
    });
  }
}
