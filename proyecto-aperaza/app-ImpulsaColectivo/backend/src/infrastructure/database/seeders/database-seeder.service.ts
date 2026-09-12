import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { seedPromoters } from '../../../features/business/promoters/infrastructure/persistence/seeders/promoters.seeder';
import { seedContributors } from '../../../features/business/contributors/infrastructure/persistence/seeders/contributors.seeder';
import { seedProjects } from '../../../features/business/projects/infrastructure/persistence/seeders/projects.seeder';
import { seedGoals } from '../../../features/business/goals/infrastructure/persistence/seeders/goals.seeder';
import { seedRewards } from '../../../features/business/rewards/infrastructure/persistence/seeders/rewards.seeder';

@Injectable()
export class DatabaseSeederService implements OnModuleInit {
  private readonly logger = new Logger(DatabaseSeederService.name);

  async onModuleInit(): Promise<void> {
    if (process.env.NODE_ENV === 'production') {
      return;
    }

    try {
      await seedPromoters();
      await seedContributors();
      await seedProjects();
      await seedGoals();
      await seedRewards();
      this.logger.log('✅ Seeders ejecutados');
    } catch (error: any) {
      this.logger.error(`❌ Error en seeders: ${error.message}`, error.stack);
      throw error;
    }
  }
}
