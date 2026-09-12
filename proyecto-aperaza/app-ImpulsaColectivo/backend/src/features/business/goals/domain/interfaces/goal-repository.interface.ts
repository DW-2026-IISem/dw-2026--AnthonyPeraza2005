import { PaginatedResult } from '../../../../../common/interfaces/pagination.interface';
import { Goal } from '../entities/goal.entity';

export const GOAL_REPOSITORY = 'GOAL_REPOSITORY';

export interface GoalFindAllParams {
  page?: number;
  limit?: number;
  search?: string;
  projectId?: number;
}

export interface IGoalRepository {
  create(goal: Goal): Promise<Goal>;
  update(goal: Goal): Promise<Goal>;
  delete(id: number): Promise<void>;
  findById(id: number): Promise<Goal | null>;
  findAll(params: GoalFindAllParams): Promise<PaginatedResult<Goal>>;
}
