import { CreationAttributes, Transaction } from "sequelize";
import { Contribution } from "./contribution.model";

/**
 * Único punto del feature que habla con Sequelize.
 * El service nunca importa el modelo directamente.
 */
export class ContributionRepository {
  public async findAll(): Promise<Contribution[]> {
    return Contribution.findAll();
  }

  public async findById(id: number, transaction?: Transaction): Promise<Contribution | null> {
    return Contribution.findByPk(id, { transaction });
  }

  public async create(data: CreationAttributes<Contribution>): Promise<Contribution> {
    return Contribution.create(data);
  }

  public async update(contribution: Contribution, data: Record<string, unknown>): Promise<Contribution> {
    return contribution.update(data);
  }

  public async delete(contribution: Contribution): Promise<void> {
    await contribution.destroy();
  }
}
