import { Module } from '@nestjs/common';
import { ProjectsModule } from '../projects/projects.module';
import { PROJECT_AUDIT_REPOSITORY } from './domain/interfaces/project-audit-repository.interface';
import { ProjectAuditRepository } from './infrastructure/persistence/repositories/project-audit.repository';
import { CreateProjectAuditUseCase } from './application/use-cases/create-project-audit.use-case';
import { UpdateProjectAuditUseCase } from './application/use-cases/update-project-audit.use-case';
import { DeleteProjectAuditUseCase } from './application/use-cases/delete-project-audit.use-case';
import { GetProjectAuditUseCase } from './application/use-cases/get-project-audit.use-case';
import { ListProjectAuditsUseCase } from './application/use-cases/list-project-audits.use-case';
import { ProjectAuditsController } from './presentation/http/controllers/project-audits.controller';

@Module({
  imports: [ProjectsModule],
  controllers: [ProjectAuditsController],
  providers: [
    ProjectAuditRepository,
    { provide: PROJECT_AUDIT_REPOSITORY, useExisting: ProjectAuditRepository },
    CreateProjectAuditUseCase,
    UpdateProjectAuditUseCase,
    DeleteProjectAuditUseCase,
    GetProjectAuditUseCase,
    ListProjectAuditsUseCase,
  ],
  exports: [PROJECT_AUDIT_REPOSITORY],
})
export class ProjectAuditsModule {}
