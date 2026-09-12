import { Module } from '@nestjs/common';
import { PromotersModule } from './promoters/promoters.module';
import { ContributorsModule } from './contributors/contributors.module';
import { ProjectsModule } from './projects/projects.module';
import { GoalsModule } from './goals/goals.module';
import { RewardsModule } from './rewards/rewards.module';
import { ContributionsModule } from './contributions/contributions.module';
import { PaymentTransactionsModule } from './payment-transactions/payment-transactions.module';

@Module({
  imports: [PromotersModule, ContributorsModule, ProjectsModule, GoalsModule, RewardsModule, ContributionsModule, PaymentTransactionsModule],
  exports: [PromotersModule, ContributorsModule, ProjectsModule, GoalsModule, RewardsModule, ContributionsModule, PaymentTransactionsModule],
})
export class BusinessModule {}
