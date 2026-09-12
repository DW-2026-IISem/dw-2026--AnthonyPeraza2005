import { Module } from '@nestjs/common';
import { PromotersModule } from './promoters/promoters.module';

@Module({
  imports: [PromotersModule],
  exports: [PromotersModule],
})
export class BusinessModule {}
