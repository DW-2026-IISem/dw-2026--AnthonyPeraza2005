import { Inject, Injectable } from '@nestjs/common';
import {
  IProjectAuditRepository,
  PROJECT_AUDIT_REPOSITORY,
} from '../../domain/interfaces/project-audit-repository.interface';
import { ProjectAuditFilterDto } from '../dto/project-audit-filter.dto';
import { ProjectAuditMapper } from '../mappers/project-audit.mapper';

@Injectable()
export class ListProjectAuditsUseCase {
  constructor(
    @Inject(PROJECT_AUDIT_REPOSITORY)
    private readonly projectAuditRepository: IProjectAuditRepository,
  ) {}

  async execute(filter: ProjectAuditFilterDto) {
    const result = await this.projectAuditRepository.findAll(filter);
    return {
      items: result.items.map((item) => ProjectAuditMapper.toResponse(item)),
      meta: result.meta,
    };
  }
}
