import { Goal } from '../../domain/entities/goal.entity';
import { GoalResponseDto } from '../dto/goal-response.dto';
import { GoalModel } from '../../infrastructure/persistence/models/goal.model';

export class GoalMapper {
  static toDomain(model: GoalModel): Goal {
    return Goal.reconstitute({
      id: model.id,
      name: model.name,
      description: model.description ?? undefined,
      isActive: model.isActive,
      projectId: model.projectId,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    });
  }

  static toResponse(entity: Goal): GoalResponseDto {
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

  static toPersistence(entity: Goal): Partial<GoalModel> {
    return {
      id: entity.id,
      name: entity.name,
      description: entity.description ?? null,
      isActive: entity.isActive ?? true,
      projectId: entity.projectId,
    };
  }
}
