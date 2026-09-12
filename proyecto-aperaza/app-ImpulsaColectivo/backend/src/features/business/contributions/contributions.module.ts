import { Module } from '@nestjs/common';
import { ProjectsModule } from '../projects/projects.module';
import { ContributorsModule } from '../contributors/contributors.module';
import { CONTRIBUTION_REPOSITORY } from './domain/interfaces/contribution-repository.interface';
import { ContributionRepository } from './infrastructure/persistence/repositories/contribution.repository';
import { CreateContributionUseCase } from './application/use-cases/create-contribution.use-case';
import { UpdateContributionUseCase } from './application/use-cases/update-contribution.use-case';
import { DeleteContributionUseCase } from './application/use-cases/delete-contribution.use-case';
import { GetContributionUseCase } from './application/use-cases/get-contribution.use-case';
import { ListContributionsUseCase } from './application/use-cases/list-contributions.use-case';
import { ContributionsController } from './presentation/http/controllers/contributions.controller';

@Module({
  imports: [ProjectsModule, ContributorsModule],
  controllers: [ContributionsController],
  providers: [
    ContributionRepository,
    { provide: CONTRIBUTION_REPOSITORY, useExisting: ContributionRepository },
    CreateContributionUseCase,
    UpdateContributionUseCase,
    DeleteContributionUseCase,
    GetContributionUseCase,
    ListContributionsUseCase,
  ],
  exports: [CONTRIBUTION_REPOSITORY],
})
export class ContributionsModule {}
