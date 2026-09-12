import { Module } from '@nestjs/common';
import { PromotersModule } from './promoters/promoters.module';
import { ContributorsModule } from './contributors/contributors.module';

@Module({
  imports: [PromotersModule, ContributorsModule],
  exports: [PromotersModule, ContributorsModule],
})
export class BusinessModule {}
