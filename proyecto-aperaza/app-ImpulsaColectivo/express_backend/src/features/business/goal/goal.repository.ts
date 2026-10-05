import { CreationAttributes, Transaction } from "sequelize";
import { Goal } from "./goal.model";

/**
 * Único punto del feature que habla con Sequelize.
 * El service nunca importa el modelo directamente.
 */
export class GoalRepository {
  public async findAll(): Promise<Goal[]> {
    return Goal.findAll();
  }

  public async findById(id: number, transaction?: Transaction): Promise<Goal | null> {
    return Goal.findByPk(id, { transaction });
  }

  public async create(data: CreationAttributes<Goal>): Promise<Goal> {
    return Goal.create(data);
  }

  public async update(goal: Goal, data: Record<string, unknown>): Promise<Goal> {
    return goal.update(data);
  }

  public async delete(goal: Goal): Promise<void> {
    await goal.destroy();
  }
}
