import { PromoterModel } from '../models/promoter.model';

export async function seedPromoters(): Promise<void> {
  const count = await PromoterModel.count();
  if (count > 0) {
    return;
  }

  await PromoterModel.bulkCreate([
    {
      name: 'Fundación ImpulsaColectivo',
      description: 'Organización que publica campañas de financiación',
      isActive: true,
    },
    {
      name: 'Cooperativa Manos Unidas',
      description: 'Colectivo comunitario de emprendimiento',
      isActive: true,
    },
  ]);
}
