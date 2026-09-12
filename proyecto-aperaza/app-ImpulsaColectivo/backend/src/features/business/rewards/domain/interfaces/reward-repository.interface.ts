import { PaginatedResult } from '../../../../../common/interfaces/pagination.interface';
import { Reward } from '../entities/reward.entity';

export const REWARD_REPOSITORY = 'REWARD_REPOSITORY';

export interface RewardFindAllParams {
  page?: number;
  limit?: number;
  search?: string;
  projectId?: number;
}

export interface IRewardRepository {
  create(reward: Reward): Promise<Reward>;
  update(reward: Reward): Promise<Reward>;
  delete(id: number): Promise<void>;
  findById(id: number): Promise<Reward | null>;
  findAll(params: RewardFindAllParams): Promise<PaginatedResult<Reward>>;
}
