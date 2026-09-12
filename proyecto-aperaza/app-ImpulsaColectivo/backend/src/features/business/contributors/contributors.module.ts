import { Module } from '@nestjs/common';
import { CONTRIBUTOR_REPOSITORY } from './domain/interfaces/contributor-repository.interface';
import { ContributorRepository } from './infrastructure/persistence/repositories/contributor.repository';
import { CreateContributorUseCase } from './application/use-cases/create-contributor.use-case';
import { UpdateContributorUseCase } from './application/use-cases/update-contributor.use-case';
import { DeleteContributorUseCase } from './application/use-cases/delete-contributor.use-case';
import { GetContributorUseCase } from './application/use-cases/get-contributor.use-case';
import { ListContributorsUseCase } from './application/use-cases/list-contributors.use-case';
import { ContributorsController } from './presentation/http/controllers/contributors.controller';

@Module({
  controllers: [ContributorsController],
  providers: [
    ContributorRepository,
    { provide: CONTRIBUTOR_REPOSITORY, useExisting: ContributorRepository },
    CreateContributorUseCase,
    UpdateContributorUseCase,
    DeleteContributorUseCase,
    GetContributorUseCase,
    ListContributorsUseCase,
  ],
  exports: [CONTRIBUTOR_REPOSITORY],
})
export class ContributorsModule {}
