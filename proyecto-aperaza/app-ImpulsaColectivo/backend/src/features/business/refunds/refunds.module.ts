import { Module } from '@nestjs/common';
import { ContributionsModule } from '../contributions/contributions.module';
import { REFUND_REPOSITORY } from './domain/interfaces/refund-repository.interface';
import { RefundRepository } from './infrastructure/persistence/repositories/refund.repository';
import { CreateRefundUseCase } from './application/use-cases/create-refund.use-case';
import { UpdateRefundUseCase } from './application/use-cases/update-refund.use-case';
import { DeleteRefundUseCase } from './application/use-cases/delete-refund.use-case';
import { GetRefundUseCase } from './application/use-cases/get-refund.use-case';
import { ListRefundsUseCase } from './application/use-cases/list-refunds.use-case';
import { RefundsController } from './presentation/http/controllers/refunds.controller';

@Module({
  imports: [ContributionsModule],
  controllers: [RefundsController],
  providers: [
    RefundRepository,
    { provide: REFUND_REPOSITORY, useExisting: RefundRepository },
    CreateRefundUseCase,
    UpdateRefundUseCase,
    DeleteRefundUseCase,
    GetRefundUseCase,
    ListRefundsUseCase,
  ],
  exports: [REFUND_REPOSITORY],
})
export class RefundsModule {}
