import { Inject, Injectable } from '@nestjs/common';
import {
  IRewardRepository,
  REWARD_REPOSITORY,
} from '../../domain/interfaces/reward-repository.interface';
import { RewardFilterDto } from '../dto/reward-filter.dto';
import { RewardMapper } from '../mappers/reward.mapper';

@Injectable()
export class ListRewardsUseCase {
  constructor(
    @Inject(REWARD_REPOSITORY)
    private readonly rewardRepository: IRewardRepository,
  ) {}

  async execute(filter: RewardFilterDto) {
    const result = await this.rewardRepository.findAll(filter);
    return {
      items: result.items.map((item) => RewardMapper.toResponse(item)),
      meta: result.meta,
    };
  }
}
