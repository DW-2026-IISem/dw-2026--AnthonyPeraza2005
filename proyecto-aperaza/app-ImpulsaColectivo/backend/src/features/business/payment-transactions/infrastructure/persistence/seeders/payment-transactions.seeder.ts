import { PaymentTransactionModel } from '../models/payment-transaction.model';
import { ContributionModel } from '../../../../contributions/infrastructure/persistence/models/contribution.model';
import { TransactionStatus } from '../../../../../../common/enums/transaction-status.enum';

export async function seedPaymentTransactions(): Promise<void> {
  const count = await PaymentTransactionModel.count();
  if (count > 0) {
    return;
  }

  const references = await ContributionModel.findAll({ limit: 2 });
  if (references.length === 0) {
    return;
  }

  await PaymentTransactionModel.bulkCreate(
    references.map((reference) => ({
      referenceId: reference.id,
      date: new Date(),
      amount: 50000,
      status: TransactionStatus.COMPLETADO,
      notes: 'Registro de ejemplo',
    })),
  );
}
