import { ContributionModel } from '../models/contribution.model';
import { ProjectModel } from '../../../../projects/infrastructure/persistence/models/project.model';
import { ContributorModel } from '../../../../contributors/infrastructure/persistence/models/contributor.model';

export async function seedContributions(): Promise<void> {
  const count = await ContributionModel.count();
  if (count > 0) {
    return;
  }

  const project = await ProjectModel.findOne();
  const contributor = await ContributorModel.findOne();
  if (!project || !contributor) {
    return;
  }

  await ContributionModel.bulkCreate([
    {
      name: 'Aporte inicial de lanzamiento',
      description: 'Aporte realizado por un aportante a un proyecto',
      isActive: true,
      projectId: project.id,
      contributorId: contributor.id,
    },
    {
      name: 'Aporte de seguimiento',
      description: 'Segundo aporte de ejemplo',
      isActive: true,
      projectId: project.id,
      contributorId: contributor.id,
    },
  ]);
}
