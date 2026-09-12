import { Module } from '@nestjs/common';
import { PromotersModule } from './promoters/promoters.module';
import { ContributorsModule } from './contributors/contributors.module';
import { ProjectsModule } from './projects/projects.module';

@Module({
  imports: [PromotersModule, ContributorsModule, ProjectsModule],
  exports: [PromotersModule, ContributorsModule, ProjectsModule],
})
export class BusinessModule {}
