import { Inject, Injectable } from '@nestjs/common';
import { ProjectNotFoundException } from '../../../projects/domain/exceptions/project-not-found.exception';
import {
  IProjectRepository,
  PROJECT_REPOSITORY,
} from '../../../projects/domain/interfaces/project-repository.interface';
import { ProjectAudit } from '../../domain/entities/project-audit.entity';
import {
  IProjectAuditRepository,
  PROJECT_AUDIT_REPOSITORY,
} from '../../domain/interfaces/project-audit-repository.interface';
import { CreateProjectAuditDto } from '../dto/create-project-audit.dto';
import { ProjectAuditMapper } from '../mappers/project-audit.mapper';

@Injectable()
export class CreateProjectAuditUseCase {
  constructor(
    @Inject(PROJECT_AUDIT_REPOSITORY)
    private readonly projectAuditRepository: IProjectAuditRepository,
    @Inject(PROJECT_REPOSITORY)
    private readonly projectRepository: IProjectRepository,
  ) {}

  async execute(dto: CreateProjectAuditDto) {
    const project = await this.projectRepository.findById(dto.projectId);
    if (!project) {
      throw new ProjectNotFoundException(dto.projectId);
    }

    const projectAudit = ProjectAudit.create(dto);
    const created = await this.projectAuditRepository.create(projectAudit);
    return ProjectAuditMapper.toResponse(created);
  }
}
