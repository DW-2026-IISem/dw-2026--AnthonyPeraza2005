import { Module } from '@nestjs/common';
import { PromotersModule } from '../promoters/promoters.module';
import { PROJECT_REPOSITORY } from './domain/interfaces/project-repository.interface';
import { ProjectRepository } from './infrastructure/persistence/repositories/project.repository';
import { CreateProjectUseCase } from './application/use-cases/create-project.use-case';
import { UpdateProjectUseCase } from './application/use-cases/update-project.use-case';
import { DeleteProjectUseCase } from './application/use-cases/delete-project.use-case';
import { GetProjectUseCase } from './application/use-cases/get-project.use-case';
import { ListProjectsUseCase } from './application/use-cases/list-projects.use-case';
import { ProjectsController } from './presentation/http/controllers/projects.controller';

@Module({
  imports: [PromotersModule],
  controllers: [ProjectsController],
  providers: [
    ProjectRepository,
    { provide: PROJECT_REPOSITORY, useExisting: ProjectRepository },
    CreateProjectUseCase,
    UpdateProjectUseCase,
    DeleteProjectUseCase,
    GetProjectUseCase,
    ListProjectsUseCase,
  ],
  exports: [PROJECT_REPOSITORY],
})
export class ProjectsModule {}
