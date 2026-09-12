import { Inject, Injectable } from '@nestjs/common';
import { PaymentTransactionNotFoundException } from '../../domain/exceptions/payment-transaction-not-found.exception';
import {
  IPaymentTransactionRepository,
  PAYMENT_TRANSACTION_REPOSITORY,
} from '../../domain/interfaces/payment-transaction-repository.interface';

@Injectable()
export class DeletePaymentTransactionUseCase {
  constructor(
    @Inject(PAYMENT_TRANSACTION_REPOSITORY)
    private readonly paymentTransactionRepository: IPaymentTransactionRepository,
  ) {}

  async execute(id: number): Promise<void> {
    const paymentTransaction = await this.paymentTransactionRepository.findById(id);
    if (!paymentTransaction) {
      throw new PaymentTransactionNotFoundException(id);
    }

    await this.paymentTransactionRepository.delete(id);
  }
}
