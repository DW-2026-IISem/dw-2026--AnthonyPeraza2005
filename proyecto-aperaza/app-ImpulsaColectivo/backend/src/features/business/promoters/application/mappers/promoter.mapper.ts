import { Promoter } from '../../domain/entities/promoter.entity';
import { PromoterResponseDto } from '../dto/promoter-response.dto';
import { PromoterModel } from '../../infrastructure/persistence/models/promoter.model';

export class PromoterMapper {
  static toDomain(model: PromoterModel): Promoter {
    return Promoter.reconstitute({
      id: model.id,
      name: model.name,
      description: model.description ?? undefined,
      isActive: model.isActive,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    });
  }

  static toResponse(entity: Promoter): PromoterResponseDto {
    return {
      id: entity.id!,
      name: entity.name,
      description: entity.description,
      isActive: entity.isActive,
      createdAt: entity.createdAt!,
      updatedAt: entity.updatedAt!,
    };
  }

  static toPersistence(entity: Promoter): Partial<PromoterModel> {
    return {
      id: entity.id,
      name: entity.name,
      description: entity.description ?? null,
      isActive: entity.isActive ?? true,
    };
  }
}
