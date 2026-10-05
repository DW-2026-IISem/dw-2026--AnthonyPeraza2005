import { CreationAttributes, Transaction } from "sequelize";
import { Contributor } from "./contributor.model";

/**
 * Único punto del feature que habla con Sequelize.
 * El service nunca importa el modelo directamente.
 */
export class ContributorRepository {
  public async findAll(): Promise<Contributor[]> {
    return Contributor.findAll();
  }

  public async findById(id: number, transaction?: Transaction): Promise<Contributor | null> {
    return Contributor.findByPk(id, { transaction });
  }

  public async findByEmail(email: string): Promise<Contributor | null> {
    return Contributor.findOne({ where: { email } });
  }

  public async create(data: CreationAttributes<Contributor>): Promise<Contributor> {
    return Contributor.create(data);
  }

  public async update(contributor: Contributor, data: Partial<Contributor>): Promise<Contributor> {
    return contributor.update(data);
  }

  public async delete(contributor: Contributor): Promise<void> {
    await contributor.destroy();
  }
}
