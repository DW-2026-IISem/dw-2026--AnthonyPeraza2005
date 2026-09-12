import { Inject, Injectable } from '@nestjs/common';
import { ProjectNotFoundException } from '../../../projects/domain/exceptions/project-not-found.exception';
import {
  IProjectRepository,
  PROJECT_REPOSITORY,
} from '../../../projects/domain/interfaces/project-repository.interface';
import { Reward } from '../../domain/entities/reward.entity';
import {
  IRewardRepository,
  REWARD_REPOSITORY,
} from '../../domain/interfaces/reward-repository.interface';
import { CreateRewardDto } from '../dto/create-reward.dto';
import { RewardMapper } from '../mappers/reward.mapper';

@Injectable()
export class CreateRewardUseCase {
  constructor(
    @Inject(REWARD_REPOSITORY)
    private readonly rewardRepository: IRewardRepository,
    @Inject(PROJECT_REPOSITORY)
    private readonly projectRepository: IProjectRepository,
  ) {}

  async execute(dto: CreateRewardDto) {
    const project = await this.projectRepository.findById(dto.projectId);
    if (!project) {
      throw new ProjectNotFoundException(dto.projectId);
    }

    const reward = Reward.create(dto);
    const created = await this.rewardRepository.create(reward);
    return RewardMapper.toResponse(created);
  }
}
