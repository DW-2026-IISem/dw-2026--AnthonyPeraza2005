import { Module } from '@nestjs/common';
import { ProjectsModule } from '../projects/projects.module';
import { REWARD_REPOSITORY } from './domain/interfaces/reward-repository.interface';
import { RewardRepository } from './infrastructure/persistence/repositories/reward.repository';
import { CreateRewardUseCase } from './application/use-cases/create-reward.use-case';
import { UpdateRewardUseCase } from './application/use-cases/update-reward.use-case';
import { DeleteRewardUseCase } from './application/use-cases/delete-reward.use-case';
import { GetRewardUseCase } from './application/use-cases/get-reward.use-case';
import { ListRewardsUseCase } from './application/use-cases/list-rewards.use-case';
import { RewardsController } from './presentation/http/controllers/rewards.controller';

@Module({
  imports: [ProjectsModule],
  controllers: [RewardsController],
  providers: [
    RewardRepository,
    { provide: REWARD_REPOSITORY, useExisting: RewardRepository },
    CreateRewardUseCase,
    UpdateRewardUseCase,
    DeleteRewardUseCase,
    GetRewardUseCase,
    ListRewardsUseCase,
  ],
  exports: [REWARD_REPOSITORY],
})
export class RewardsModule {}
