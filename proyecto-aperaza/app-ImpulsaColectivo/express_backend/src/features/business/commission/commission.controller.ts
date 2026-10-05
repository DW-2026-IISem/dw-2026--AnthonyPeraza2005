import { Request, Response } from "express";
import { BaseController } from "../../../shared/http/base-controller";
import { CommissionService } from "./commission.service";
import { toCommissionResponse } from "./dto";

export class CommissionController extends BaseController {
  constructor(private readonly service: CommissionService = new CommissionService()) {
    super();
  }

  async getAll(_req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const commissions = await this.service.getAll();
      res.status(200).json({ commissions: commissions.map(toCommissionResponse) });
    });
  }

  async getOne(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const commission = await this.service.getOne(this.paramId(req));
      res.status(200).json({ commission: toCommissionResponse(commission) });
    });
  }

  async create(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const commission = await this.service.create(req.body);
      res.status(201).json({ commission: toCommissionResponse(commission) });
    });
  }

  async updatePut(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const commission = await this.service.updatePut(this.paramId(req), req.body);
      res.status(200).json({ commission: toCommissionResponse(commission) });
    });
  }

  async updatePatch(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const commission = await this.service.updatePatch(this.paramId(req), req.body);
      res.status(200).json({ commission: toCommissionResponse(commission) });
    });
  }

  async deletePhysical(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      await this.service.deletePhysical(this.paramId(req));
      res.status(200).json({ message: "Commission eliminada físicamente" });
    });
  }

  async deleteLogical(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      await this.service.deleteLogical(this.paramId(req));
      res.status(200).json({ message: "Commission desactivada (borrado lógico)" });
    });
  }
}
