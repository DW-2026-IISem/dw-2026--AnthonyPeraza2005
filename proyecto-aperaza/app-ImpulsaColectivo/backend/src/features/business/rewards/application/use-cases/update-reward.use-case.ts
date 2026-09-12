import { Inject, Injectable } from '@nestjs/common';
import { RewardNotFoundException } from '../../domain/exceptions/reward-not-found.exception';
import {
  IRewardRepository,
  REWARD_REPOSITORY,
} from '../../domain/interfaces/reward-repository.interface';
import { UpdateRewardDto } from '../dto/update-reward.dto';
import { RewardMapper } from '../mappers/reward.mapper';

@Injectable()
export class UpdateRewardUseCase {
  constructor(
    @Inject(REWARD_REPOSITORY)
    private readonly rewardRepository: IRewardRepository,
  ) {}

  async execute(id: number, dto: UpdateRewardDto) {
    const reward = await this.rewardRepository.findById(id);
    if (!reward) {
      throw new RewardNotFoundException(id);
    }

    reward.update(dto);
    const updated = await this.rewardRepository.update(reward);
    return RewardMapper.toResponse(updated);
  }
}
