import { GoalModel } from '../models/goal.model';
import { ProjectModel } from '../../../../projects/infrastructure/persistence/models/project.model';

export async function seedGoals(): Promise<void> {
  const count = await GoalModel.count();
  if (count > 0) {
    return;
  }

  const project = await ProjectModel.findOne();
  if (!project) {
    return;
  }

  await GoalModel.bulkCreate([
    {
      name: 'Recaudar $10.000.000 antes de diciembre',
      description: 'Meta principal de la campaña',
      isActive: true,
      projectId: project.id,
    },
    {
      name: 'Meta adicional de expansión',
      description: 'Meta secundaria de la campaña',
      isActive: true,
      projectId: project.id,
    },
  ]);
}
