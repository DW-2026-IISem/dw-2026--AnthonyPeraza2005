import { Module } from '@nestjs/common';
import { ContributionsModule } from '../contributions/contributions.module';
import { PAYMENT_TRANSACTION_REPOSITORY } from './domain/interfaces/payment-transaction-repository.interface';
import { PaymentTransactionRepository } from './infrastructure/persistence/repositories/payment-transaction.repository';
import { CreatePaymentTransactionUseCase } from './application/use-cases/create-payment-transaction.use-case';
import { UpdatePaymentTransactionUseCase } from './application/use-cases/update-payment-transaction.use-case';
import { DeletePaymentTransactionUseCase } from './application/use-cases/delete-payment-transaction.use-case';
import { GetPaymentTransactionUseCase } from './application/use-cases/get-payment-transaction.use-case';
import { ListPaymentTransactionsUseCase } from './application/use-cases/list-payment-transactions.use-case';
import { PaymentTransactionsController } from './presentation/http/controllers/payment-transactions.controller';

@Module({
  imports: [ContributionsModule],
  controllers: [PaymentTransactionsController],
  providers: [
    PaymentTransactionRepository,
    { provide: PAYMENT_TRANSACTION_REPOSITORY, useExisting: PaymentTransactionRepository },
    CreatePaymentTransactionUseCase,
    UpdatePaymentTransactionUseCase,
    DeletePaymentTransactionUseCase,
    GetPaymentTransactionUseCase,
    ListPaymentTransactionsUseCase,
  ],
  exports: [PAYMENT_TRANSACTION_REPOSITORY],
})
export class PaymentTransactionsModule {}
