import { Inject, Injectable } from '@nestjs/common';
import { PaymentTransactionNotFoundException } from '../../domain/exceptions/payment-transaction-not-found.exception';
import {
  IPaymentTransactionRepository,
  PAYMENT_TRANSACTION_REPOSITORY,
} from '../../domain/interfaces/payment-transaction-repository.interface';
import { UpdatePaymentTransactionDto } from '../dto/update-payment-transaction.dto';
import { PaymentTransactionMapper } from '../mappers/payment-transaction.mapper';

@Injectable()
export class UpdatePaymentTransactionUseCase {
  constructor(
    @Inject(PAYMENT_TRANSACTION_REPOSITORY)
    private readonly paymentTransactionRepository: IPaymentTransactionRepository,
  ) {}

  async execute(id: number, dto: UpdatePaymentTransactionDto) {
    const paymentTransaction = await this.paymentTransactionRepository.findById(id);
    if (!paymentTransaction) {
      throw new PaymentTransactionNotFoundException(id);
    }

    paymentTransaction.update(dto);
    const updated = await this.paymentTransactionRepository.update(paymentTransaction);
    return PaymentTransactionMapper.toResponse(updated);
  }
}
