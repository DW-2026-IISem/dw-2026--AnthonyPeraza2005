import { CommissionModel } from '../models/commission.model';
import { ProjectModel } from '../../../../projects/infrastructure/persistence/models/project.model';
import { TransactionStatus } from '../../../../../../common/enums/transaction-status.enum';

export async function seedCommissions(): Promise<void> {
  const count = await CommissionModel.count();
  if (count > 0) {
    return;
  }

  const references = await ProjectModel.findAll({ limit: 2 });
  if (references.length === 0) {
    return;
  }

  await CommissionModel.bulkCreate(
    references.map((reference) => ({
      referenceId: reference.id,
      date: new Date(),
      amount: 50000,
      status: TransactionStatus.COMPLETADO,
      notes: 'Registro de ejemplo',
    })),
  );
}
