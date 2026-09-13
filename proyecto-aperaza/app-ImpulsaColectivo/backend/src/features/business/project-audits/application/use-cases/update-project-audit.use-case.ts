import { Inject, Injectable } from '@nestjs/common';
import { ProjectAuditNotFoundException } from '../../domain/exceptions/project-audit-not-found.exception';
import {
  IProjectAuditRepository,
  PROJECT_AUDIT_REPOSITORY,
} from '../../domain/interfaces/project-audit-repository.interface';
import { UpdateProjectAuditDto } from '../dto/update-project-audit.dto';
import { ProjectAuditMapper } from '../mappers/project-audit.mapper';

@Injectable()
export class UpdateProjectAuditUseCase {
  constructor(
    @Inject(PROJECT_AUDIT_REPOSITORY)
    private readonly projectAuditRepository: IProjectAuditRepository,
  ) {}

  async execute(id: number, dto: UpdateProjectAuditDto) {
    const projectAudit = await this.projectAuditRepository.findById(id);
    if (!projectAudit) {
      throw new ProjectAuditNotFoundException(id);
    }

    projectAudit.update(dto);
    const updated = await this.projectAuditRepository.update(projectAudit);
    return ProjectAuditMapper.toResponse(updated);
  }
}
