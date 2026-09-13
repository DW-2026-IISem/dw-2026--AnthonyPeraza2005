import { Inject, Injectable } from '@nestjs/common';
import { ProjectAuditNotFoundException } from '../../domain/exceptions/project-audit-not-found.exception';
import {
  IProjectAuditRepository,
  PROJECT_AUDIT_REPOSITORY,
} from '../../domain/interfaces/project-audit-repository.interface';
import { ProjectAuditMapper } from '../mappers/project-audit.mapper';

@Injectable()
export class GetProjectAuditUseCase {
  constructor(
    @Inject(PROJECT_AUDIT_REPOSITORY)
    private readonly projectAuditRepository: IProjectAuditRepository,
  ) {}

  async execute(id: number) {
    const projectAudit = await this.projectAuditRepository.findById(id);
    if (!projectAudit) {
      throw new ProjectAuditNotFoundException(id);
    }

    return ProjectAuditMapper.toResponse(projectAudit);
  }
}
