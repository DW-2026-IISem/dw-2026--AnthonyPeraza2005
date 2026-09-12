import { PaymentTransaction } from '../../domain/entities/payment-transaction.entity';
import { PaymentTransactionResponseDto } from '../dto/payment-transaction-response.dto';
import { PaymentTransactionModel } from '../../infrastructure/persistence/models/payment-transaction.model';

export class PaymentTransactionMapper {
  static toDomain(model: PaymentTransactionModel): PaymentTransaction {
    return PaymentTransaction.reconstitute({
      id: model.id,
      referenceId: model.referenceId,
      date: model.date,
      amount: Number(model.amount),
      status: model.status,
      notes: model.notes ?? undefined,
    });
  }

  static toResponse(entity: PaymentTransaction): PaymentTransactionResponseDto {
    return {
      id: entity.id!,
      referenceId: entity.referenceId,
      date: entity.date,
      amount: entity.amount,
      status: entity.status,
      notes: entity.notes,
    };
  }

  static toPersistence(entity: PaymentTransaction): Partial<PaymentTransactionModel> {
    return {
      id: entity.id,
      referenceId: entity.referenceId,
      date: entity.date,
      amount: entity.amount,
      status: entity.status,
      notes: entity.notes ?? null,
    };
  }
}
