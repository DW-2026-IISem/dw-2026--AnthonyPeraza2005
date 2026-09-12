import { Inject, Injectable } from '@nestjs/common';
import {
  IPaymentTransactionRepository,
  PAYMENT_TRANSACTION_REPOSITORY,
} from '../../domain/interfaces/payment-transaction-repository.interface';
import { PaymentTransactionFilterDto } from '../dto/payment-transaction-filter.dto';
import { PaymentTransactionMapper } from '../mappers/payment-transaction.mapper';

@Injectable()
export class ListPaymentTransactionsUseCase {
  constructor(
    @Inject(PAYMENT_TRANSACTION_REPOSITORY)
    private readonly paymentTransactionRepository: IPaymentTransactionRepository,
  ) {}

  async execute(filter: PaymentTransactionFilterDto) {
    const result = await this.paymentTransactionRepository.findAll(filter);
    return {
      items: result.items.map((item) => PaymentTransactionMapper.toResponse(item)),
      meta: result.meta,
    };
  }
}
