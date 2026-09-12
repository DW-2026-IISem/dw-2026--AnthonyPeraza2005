import { Contributor } from '../../domain/entities/contributor.entity';
import { ContributorResponseDto } from '../dto/contributor-response.dto';
import { ContributorModel } from '../../infrastructure/persistence/models/contributor.model';

export class ContributorMapper {
  static toDomain(model: ContributorModel): Contributor {
    return Contributor.reconstitute({
      id: model.id,
      name: model.name,
      description: model.description ?? undefined,
      isActive: model.isActive,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    });
  }

  static toResponse(entity: Contributor): ContributorResponseDto {
    return {
      id: entity.id!,
      name: entity.name,
      description: entity.description,
      isActive: entity.isActive,
      createdAt: entity.createdAt!,
      updatedAt: entity.updatedAt!,
    };
  }

  static toPersistence(entity: Contributor): Partial<ContributorModel> {
    return {
      id: entity.id,
      name: entity.name,
      description: entity.description ?? null,
      isActive: entity.isActive ?? true,
    };
  }
}
