import { Inject, Injectable } from '@nestjs/common';
import { PaymentTransactionNotFoundException } from '../../domain/exceptions/payment-transaction-not-found.exception';
import {
  IPaymentTransactionRepository,
  PAYMENT_TRANSACTION_REPOSITORY,
} from '../../domain/interfaces/payment-transaction-repository.interface';
import { PaymentTransactionMapper } from '../mappers/payment-transaction.mapper';

@Injectable()
export class GetPaymentTransactionUseCase {
  constructor(
    @Inject(PAYMENT_TRANSACTION_REPOSITORY)
    private readonly paymentTransactionRepository: IPaymentTransactionRepository,
  ) {}

  async execute(id: number) {
    const paymentTransaction = await this.paymentTransactionRepository.findById(id);
    if (!paymentTransaction) {
      throw new PaymentTransactionNotFoundException(id);
    }

    return PaymentTransactionMapper.toResponse(paymentTransaction);
  }
}
