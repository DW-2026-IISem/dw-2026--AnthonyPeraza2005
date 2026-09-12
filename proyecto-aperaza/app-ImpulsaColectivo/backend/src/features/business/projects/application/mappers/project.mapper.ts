import { Project } from '../../domain/entities/project.entity';
import { ProjectResponseDto } from '../dto/project-response.dto';
import { ProjectModel } from '../../infrastructure/persistence/models/project.model';

export class ProjectMapper {
  static toDomain(model: ProjectModel): Project {
    return Project.reconstitute({
      id: model.id,
      name: model.name,
      description: model.description ?? undefined,
      isActive: model.isActive,
      promoterId: model.promoterId,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    });
  }

  static toResponse(entity: Project): ProjectResponseDto {
    return {
      id: entity.id!,
      name: entity.name,
      description: entity.description,
      isActive: entity.isActive,
      promoterId: entity.promoterId,
      createdAt: entity.createdAt!,
      updatedAt: entity.updatedAt!,
    };
  }

  static toPersistence(entity: Project): Partial<ProjectModel> {
    return {
      id: entity.id,
      name: entity.name,
      description: entity.description ?? null,
      isActive: entity.isActive ?? true,
      promoterId: entity.promoterId,
    };
  }
}
