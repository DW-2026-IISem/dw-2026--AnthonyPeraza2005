import { CreationAttributes, Transaction } from "sequelize";
import { Refund } from "./refund.model";

export class RefundRepository {
  async findAll(): Promise<Refund[]> {
    return Refund.findAll();
  }

  async findById(id: number, transaction?: Transaction): Promise<Refund | null> {
    return Refund.findByPk(id, { transaction });
  }

  async create(data: CreationAttributes<Refund>): Promise<Refund> {
    return Refund.create(data);
  }

  async update(refund: Refund, data: Record<string, unknown>): Promise<Refund> {
    return refund.update(data);
  }

  async delete(refund: Refund): Promise<void> {
    await refund.destroy();
  }
}
