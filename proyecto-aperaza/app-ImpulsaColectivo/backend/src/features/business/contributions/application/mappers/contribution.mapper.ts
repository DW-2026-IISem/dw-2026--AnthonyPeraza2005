import { Contribution } from '../../domain/entities/contribution.entity';
import { ContributionResponseDto } from '../dto/contribution-response.dto';
import { ContributionModel } from '../../infrastructure/persistence/models/contribution.model';

export class ContributionMapper {
  static toDomain(model: ContributionModel): Contribution {
    return Contribution.reconstitute({
      id: model.id,
      name: model.name,
      description: model.description ?? undefined,
      isActive: model.isActive,
      projectId: model.projectId,
      contributorId: model.contributorId,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    });
  }

  static toResponse(entity: Contribution): ContributionResponseDto {
    return {
      id: entity.id!,
      name: entity.name,
      description: entity.description,
      isActive: entity.isActive,
      projectId: entity.projectId,
      contributorId: entity.contributorId,
      createdAt: entity.createdAt!,
      updatedAt: entity.updatedAt!,
    };
  }

  static toPersistence(entity: Contribution): Partial<ContributionModel> {
    return {
      id: entity.id,
      name: entity.name,
      description: entity.description ?? null,
      isActive: entity.isActive ?? true,
      projectId: entity.projectId,
      contributorId: entity.contributorId,
    };
  }
}
