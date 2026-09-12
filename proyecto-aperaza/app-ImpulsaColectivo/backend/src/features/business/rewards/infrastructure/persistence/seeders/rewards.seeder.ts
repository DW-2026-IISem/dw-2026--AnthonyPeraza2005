import { RewardModel } from '../models/reward.model';
import { ProjectModel } from '../../../../projects/infrastructure/persistence/models/project.model';

export async function seedRewards(): Promise<void> {
  const count = await RewardModel.count();
  if (count > 0) {
    return;
  }

  const project = await ProjectModel.findOne();
  if (!project) {
    return;
  }

  await RewardModel.bulkCreate([
    {
      name: 'Camiseta conmemorativa',
      description: 'Recompensa por aporte básico',
      isActive: true,
      projectId: project.id,
    },
    {
      name: 'Mención en agradecimientos',
      description: 'Recompensa por aporte mínimo',
      isActive: true,
      projectId: project.id,
    },
  ]);
}
