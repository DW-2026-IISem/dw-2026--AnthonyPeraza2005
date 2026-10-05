import { CreationAttributes, Transaction } from "sequelize";
import { Reward } from "./reward.model";

/**
 * Único punto del feature que habla con Sequelize.
 * El service nunca importa el modelo directamente.
 */
export class RewardRepository {
  public async findAll(): Promise<Reward[]> {
    return Reward.findAll();
  }

  public async findById(id: number, transaction?: Transaction): Promise<Reward | null> {
    return Reward.findByPk(id, { transaction });
  }

  public async create(data: CreationAttributes<Reward>): Promise<Reward> {
    return Reward.create(data);
  }

  public async update(reward: Reward, data: Record<string, unknown>): Promise<Reward> {
    return reward.update(data);
  }

  public async delete(reward: Reward): Promise<void> {
    await reward.destroy();
  }
}
