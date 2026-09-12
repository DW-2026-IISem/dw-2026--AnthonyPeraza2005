import { ContributorModel } from '../models/contributor.model';

export async function seedContributors(): Promise<void> {
  const count = await ContributorModel.count();
  if (count > 0) {
    return;
  }

  await ContributorModel.bulkCreate([
    {
      name: 'Laura Gómez',
      description: 'Aportante frecuente',
      isActive: true,
    },
    {
      name: 'Carlos Pérez',
      description: 'Aportante ocasional',
      isActive: true,
    },
  ]);
}
