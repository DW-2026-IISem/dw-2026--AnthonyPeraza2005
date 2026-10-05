import { Request, Response } from "express";
import { BaseController } from "../../../shared/http/base-controller";
import { RefundService } from "./refund.service";
import { toRefundResponse } from "./dto";

export class RefundController extends BaseController {
  constructor(private readonly service: RefundService = new RefundService()) {
    super();
  }

  async getAll(_req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const refunds = await this.service.getAll();
      res.status(200).json({ refunds: refunds.map(toRefundResponse) });
    });
  }

  async getOne(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const refund = await this.service.getOne(this.paramId(req));
      res.status(200).json({ refund: toRefundResponse(refund) });
    });
  }

  async create(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const refund = await this.service.create(req.body);
      res.status(201).json({ refund: toRefundResponse(refund) });
    });
  }

  async updatePut(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const refund = await this.service.updatePut(this.paramId(req), req.body);
      res.status(200).json({ refund: toRefundResponse(refund) });
    });
  }

  async updatePatch(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const refund = await this.service.updatePatch(this.paramId(req), req.body);
      res.status(200).json({ refund: toRefundResponse(refund) });
    });
  }

  async deletePhysical(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      await this.service.deletePhysical(this.paramId(req));
      res.status(200).json({ message: "Refund eliminado físicamente" });
    });
  }

  async deleteLogical(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      await this.service.deleteLogical(this.paramId(req));
      res.status(200).json({ message: "Refund desactivado (borrado lógico)" });
    });
  }
}
