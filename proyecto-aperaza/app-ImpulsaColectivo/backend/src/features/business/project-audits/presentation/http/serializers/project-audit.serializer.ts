import { ProjectAudit } from '../../../domain/entities/project-audit.entity';
import { ProjectAuditResponseDto } from '../../../application/dto/project-audit-response.dto';
import { ProjectAuditMapper } from '../../../application/mappers/project-audit.mapper';

export class ProjectAuditSerializer {
  static serialize(entity: ProjectAudit): ProjectAuditResponseDto {
    return ProjectAuditMapper.toResponse(entity);
  }
}
