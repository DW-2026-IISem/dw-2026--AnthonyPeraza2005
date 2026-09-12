import { PaginatedResult } from '../../../../../common/interfaces/pagination.interface';
import { PaymentTransaction } from '../entities/payment-transaction.entity';
import { TransactionStatus } from '../../../../../common/enums/transaction-status.enum';

export const PAYMENT_TRANSACTION_REPOSITORY = 'PAYMENT_TRANSACTION_REPOSITORY';

export interface PaymentTransactionFindAllParams {
  page?: number;
  limit?: number;
  referenceId?: number;
  status?: TransactionStatus;
}

export interface IPaymentTransactionRepository {
  create(paymentTransaction: PaymentTransaction): Promise<PaymentTransaction>;
  update(paymentTransaction: PaymentTransaction): Promise<PaymentTransaction>;
  delete(id: number): Promise<void>;
  findById(id: number): Promise<PaymentTransaction | null>;
  findAll(params: PaymentTransactionFindAllParams): Promise<PaginatedResult<PaymentTransaction>>;
}
