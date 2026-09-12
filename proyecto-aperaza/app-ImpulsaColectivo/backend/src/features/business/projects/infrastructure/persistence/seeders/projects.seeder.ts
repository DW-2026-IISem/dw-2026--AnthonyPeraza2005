import { ProjectModel } from '../models/project.model';
import { PromoterModel } from '../../../../promoters/infrastructure/persistence/models/promoter.model';

export async function seedProjects(): Promise<void> {
  const count = await ProjectModel.count();
  if (count > 0) {
    return;
  }

  const promoter = await PromoterModel.findOne();
  if (!promoter) {
    return;
  }

  await ProjectModel.bulkCreate([
    {
      name: 'Huerta urbana comunitaria',
      description: 'Campaña de financiación colaborativa',
      isActive: true,
      promoterId: promoter.id,
    },
    {
      name: 'Biblioteca itinerante',
      description: 'Campaña de financiación colaborativa',
      isActive: true,
      promoterId: promoter.id,
    },
  ]);
}
