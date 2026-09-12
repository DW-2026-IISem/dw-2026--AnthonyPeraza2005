import { PaymentTransaction } from '../../../domain/entities/payment-transaction.entity';
import { PaymentTransactionResponseDto } from '../../../application/dto/payment-transaction-response.dto';
import { PaymentTransactionMapper } from '../../../application/mappers/payment-transaction.mapper';

export class PaymentTransactionSerializer {
  static serialize(entity: PaymentTransaction): PaymentTransactionResponseDto {
    return PaymentTransactionMapper.toResponse(entity);
  }
}
