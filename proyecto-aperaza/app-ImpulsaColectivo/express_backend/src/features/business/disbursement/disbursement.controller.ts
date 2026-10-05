import { Request, Response } from "express";
import { BaseController } from "../../../shared/http/base-controller";
import { DisbursementService } from "./disbursement.service";
import { toDisbursementResponse } from "./dto";

export class DisbursementController extends BaseController {
  constructor(private readonly service: DisbursementService = new DisbursementService()) {
    super();
  }

  async getAll(_req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const disbursements = await this.service.getAll();
      res.status(200).json({ disbursements: disbursements.map(toDisbursementResponse) });
    });
  }

  async getOne(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const disbursement = await this.service.getOne(this.paramId(req));
      res.status(200).json({ disbursement: toDisbursementResponse(disbursement) });
    });
  }

  async create(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const disbursement = await this.service.create(req.body);
      res.status(201).json({ disbursement: toDisbursementResponse(disbursement) });
    });
  }

  async updatePut(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const disbursement = await this.service.updatePut(this.paramId(req), req.body);
      res.status(200).json({ disbursement: toDisbursementResponse(disbursement) });
    });
  }

  async updatePatch(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const disbursement = await this.service.updatePatch(this.paramId(req), req.body);
      res.status(200).json({ disbursement: toDisbursementResponse(disbursement) });
    });
  }

  async deletePhysical(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      await this.service.deletePhysical(this.paramId(req));
      res.status(200).json({ message: "Disbursement eliminado físicamente" });
    });
  }

  async deleteLogical(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      await this.service.deleteLogical(this.paramId(req));
      res.status(200).json({ message: "Disbursement desactivado (borrado lógico)" });
    });
  }
}
