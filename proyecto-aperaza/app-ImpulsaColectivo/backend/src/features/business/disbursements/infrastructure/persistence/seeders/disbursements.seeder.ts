import { DisbursementModel } from '../models/disbursement.model';
import { ProjectModel } from '../../../../projects/infrastructure/persistence/models/project.model';

export async function seedDisbursements(): Promise<void> {
  const count = await DisbursementModel.count();
  if (count > 0) {
    return;
  }

  const project = await ProjectModel.findOne();
  if (!project) {
    return;
  }

  await DisbursementModel.bulkCreate([
    {
      name: 'Primer giro a la campaña',
      description: 'Giro de fondos hacia el promotor',
      isActive: true,
      projectId: project.id,
    },
    {
      name: 'Giro de cierre de campaña',
      description: 'Giro final de fondos',
      isActive: true,
      projectId: project.id,
    },
  ]);
}
