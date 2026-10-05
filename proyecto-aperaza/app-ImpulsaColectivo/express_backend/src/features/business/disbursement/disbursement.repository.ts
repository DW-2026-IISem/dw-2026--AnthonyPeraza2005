import { CreationAttributes, Transaction } from "sequelize";
import { Disbursement } from "./disbursement.model";

export class DisbursementRepository {
  async findAll(): Promise<Disbursement[]> {
    return Disbursement.findAll();
  }

  async findById(id: number, transaction?: Transaction): Promise<Disbursement | null> {
    return Disbursement.findByPk(id, { transaction });
  }

  async create(data: CreationAttributes<Disbursement>): Promise<Disbursement> {
    return Disbursement.create(data);
  }

  async update(disbursement: Disbursement, data: Record<string, unknown>): Promise<Disbursement> {
    return disbursement.update(data);
  }

  async delete(disbursement: Disbursement): Promise<void> {
    await disbursement.destroy();
  }
}
