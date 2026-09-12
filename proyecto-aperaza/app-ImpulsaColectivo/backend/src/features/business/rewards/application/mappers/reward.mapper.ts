import { Reward } from '../../domain/entities/reward.entity';
import { RewardResponseDto } from '../dto/reward-response.dto';
import { RewardModel } from '../../infrastructure/persistence/models/reward.model';

export class RewardMapper {
  static toDomain(model: RewardModel): Reward {
    return Reward.reconstitute({
      id: model.id,
      name: model.name,
      description: model.description ?? undefined,
      isActive: model.isActive,
      projectId: model.projectId,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    });
  }

  static toResponse(entity: Reward): RewardResponseDto {
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

  static toPersistence(entity: Reward): Partial<RewardModel> {
    return {
      id: entity.id,
      name: entity.name,
      description: entity.description ?? null,
      isActive: entity.isActive ?? true,
      projectId: entity.projectId,
    };
  }
}
