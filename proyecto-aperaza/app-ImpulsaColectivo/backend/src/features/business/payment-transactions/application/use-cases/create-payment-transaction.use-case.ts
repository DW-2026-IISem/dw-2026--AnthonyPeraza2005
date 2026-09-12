import { Inject, Injectable } from '@nestjs/common';
import { ContributionNotFoundException } from '../../../contributions/domain/exceptions/contribution-not-found.exception';
import {
  IContributionRepository,
  CONTRIBUTION_REPOSITORY,
} from '../../../contributions/domain/interfaces/contribution-repository.interface';
import { PaymentTransaction } from '../../domain/entities/payment-transaction.entity';
import {
  IPaymentTransactionRepository,
  PAYMENT_TRANSACTION_REPOSITORY,
} from '../../domain/interfaces/payment-transaction-repository.interface';
import { CreatePaymentTransactionDto } from '../dto/create-payment-transaction.dto';
import { PaymentTransactionMapper } from '../mappers/payment-transaction.mapper';

@Injectable()
export class CreatePaymentTransactionUseCase {
  constructor(
    @Inject(PAYMENT_TRANSACTION_REPOSITORY)
    private readonly paymentTransactionRepository: IPaymentTransactionRepository,
    @Inject(CONTRIBUTION_REPOSITORY)
    private readonly referenceRepository: IContributionRepository,
  ) {}

  async execute(dto: CreatePaymentTransactionDto) {
    const reference = await this.referenceRepository.findById(dto.referenceId);
    if (!reference) {
      throw new ContributionNotFoundException(dto.referenceId);
    }

    const paymentTransaction = PaymentTransaction.create(dto);
    const created = await this.paymentTransactionRepository.create(paymentTransaction);
    return PaymentTransactionMapper.toResponse(created);
  }
}
