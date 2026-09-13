import { Inject, Injectable } from '@nestjs/common';
import { ProjectAuditNotFoundException } from '../../domain/exceptions/project-audit-not-found.exception';
import {
  IProjectAuditRepository,
  PROJECT_AUDIT_REPOSITORY,
} from '../../domain/interfaces/project-audit-repository.interface';

@Injectable()
export class DeleteProjectAuditUseCase {
  constructor(
    @Inject(PROJECT_AUDIT_REPOSITORY)
    private readonly projectAuditRepository: IProjectAuditRepository,
  ) {}

  async execute(id: number): Promise<void> {
    const projectAudit = await this.projectAuditRepository.findById(id);
    if (!projectAudit) {
      throw new ProjectAuditNotFoundException(id);
    }

    await this.projectAuditRepository.delete(id);
  }
}
