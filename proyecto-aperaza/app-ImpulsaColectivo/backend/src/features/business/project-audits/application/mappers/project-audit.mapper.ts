import { ProjectAudit } from '../../domain/entities/project-audit.entity';
import { ProjectAuditResponseDto } from '../dto/project-audit-response.dto';
import { ProjectAuditModel } from '../../infrastructure/persistence/models/project-audit.model';

export class ProjectAuditMapper {
  static toDomain(model: ProjectAuditModel): ProjectAudit {
    return ProjectAudit.reconstitute({
      id: model.id,
      name: model.name,
      description: model.description ?? undefined,
      isActive: model.isActive,
      projectId: model.projectId,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    });
  }

  static toResponse(entity: ProjectAudit): ProjectAuditResponseDto {
    return {
      id: entity.id!,
      name: entity.name,
      description: entity.description,
      isActive: entity.isActive,
      projectId: entity.projectId,
      createdAt: entity.createdAt!,
      updatedAt: entity.updatedAt!,
    };
  }

  static toPersistence(entity: ProjectAudit): Partial<ProjectAuditModel> {
    return {
      id: entity.id,
      name: entity.name,
      description: entity.description ?? null,
      isActive: entity.isActive ?? true,
      projectId: entity.projectId,
    };
  }
}
