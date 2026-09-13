import { RefundModel } from '../models/refund.model';
import { ContributionModel } from '../../../../contributions/infrastructure/persistence/models/contribution.model';
import { TransactionStatus } from '../../../../../../common/enums/transaction-status.enum';

export async function seedRefunds(): Promise<void> {
  const count = await RefundModel.count();
  if (count > 0) {
    return;
  }

  const reference = await ContributionModel.findOne();
  if (!reference) {
    return;
  }

  await RefundModel.bulkCreate([
    {
      referenceId: reference.id,
      date: new Date(),
      reason: 'Meta no alcanzada antes de la fecha límite',
      total: 50000,
      status: TransactionStatus.PENDIENTE,
    },
  ]);
}
