import { CreationAttributes, Transaction } from "sequelize";
import { Commission } from "./commission.model";

export class CommissionRepository {
  async findAll(): Promise<Commission[]> {
    return Commission.findAll();
  }

  async findById(id: number, transaction?: Transaction): Promise<Commission | null> {
    return Commission.findByPk(id, { transaction });
  }

  async create(data: CreationAttributes<Commission>): Promise<Commission> {
    return Commission.create(data);
  }

  async update(commission: Commission, data: Record<string, unknown>): Promise<Commission> {
    return commission.update(data);
  }

  async delete(commission: Commission): Promise<void> {
    await commission.destroy();
  }
}
