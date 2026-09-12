import { Module } from '@nestjs/common';
import { PromotersModule } from './promoters/promoters.module';
import { ContributorsModule } from './contributors/contributors.module';
import { ProjectsModule } from './projects/projects.module';
import { GoalsModule } from './goals/goals.module';
import { RewardsModule } from './rewards/rewards.module';

@Module({
  imports: [PromotersModule, ContributorsModule, ProjectsModule, GoalsModule, RewardsModule],
  exports: [PromotersModule, ContributorsModule, ProjectsModule, GoalsModule, RewardsModule],
})
export class BusinessModule {}
