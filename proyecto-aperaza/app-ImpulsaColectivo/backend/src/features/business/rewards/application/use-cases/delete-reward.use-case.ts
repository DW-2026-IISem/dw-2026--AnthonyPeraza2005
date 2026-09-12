import { Inject, Injectable } from '@nestjs/common';
import { RewardNotFoundException } from '../../domain/exceptions/reward-not-found.exception';
import {
  IRewardRepository,
  REWARD_REPOSITORY,
} from '../../domain/interfaces/reward-repository.interface';

@Injectable()
export class DeleteRewardUseCase {
  constructor(
    @Inject(REWARD_REPOSITORY)
    private readonly rewardRepository: IRewardRepository,
  ) {}

  async execute(id: number): Promise<void> {
    const reward = await this.rewardRepository.findById(id);
    if (!reward) {
      throw new RewardNotFoundException(id);
    }

    await this.rewardRepository.delete(id);
  }
}
