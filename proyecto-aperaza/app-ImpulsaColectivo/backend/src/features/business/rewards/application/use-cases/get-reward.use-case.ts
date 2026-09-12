import { Inject, Injectable } from '@nestjs/common';
import { RewardNotFoundException } from '../../domain/exceptions/reward-not-found.exception';
import {
  IRewardRepository,
  REWARD_REPOSITORY,
} from '../../domain/interfaces/reward-repository.interface';
import { RewardMapper } from '../mappers/reward.mapper';

@Injectable()
export class GetRewardUseCase {
  constructor(
    @Inject(REWARD_REPOSITORY)
    private readonly rewardRepository: IRewardRepository,
  ) {}

  async execute(id: number) {
    const reward = await this.rewardRepository.findById(id);
    if (!reward) {
      throw new RewardNotFoundException(id);
    }

    return RewardMapper.toResponse(reward);
  }
}
