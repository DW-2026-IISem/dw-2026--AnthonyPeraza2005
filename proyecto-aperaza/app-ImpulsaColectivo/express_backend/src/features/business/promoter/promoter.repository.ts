import { CreationAttributes, Transaction } from "sequelize";
import { Promoter } from "./promoter.model";

/**
 * Único punto del feature que habla con Sequelize.
 * El service nunca importa el modelo directamente.
 */
export class PromoterRepository {
  public async findAll(): Promise<Promoter[]> {
    return Promoter.findAll();
  }

  public async findById(id: number, transaction?: Transaction): Promise<Promoter | null> {
    return Promoter.findByPk(id, { transaction });
  }

  public async findByEmail(email: string): Promise<Promoter | null> {
    return Promoter.findOne({ where: { contact_email: email } });
  }

  public async create(data: CreationAttributes<Promoter>): Promise<Promoter> {
    return Promoter.create(data);
  }

  public async update(promoter: Promoter, data: Partial<Promoter>): Promise<Promoter> {
    return promoter.update(data);
  }

  public async delete(promoter: Promoter): Promise<void> {
    await promoter.destroy();
  }
}
