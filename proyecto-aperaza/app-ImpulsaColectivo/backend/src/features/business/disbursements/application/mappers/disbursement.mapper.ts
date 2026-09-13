import { Disbursement } from '../../domain/entities/disbursement.entity';
import { DisbursementResponseDto } from '../dto/disbursement-response.dto';
import { DisbursementModel } from '../../infrastructure/persistence/models/disbursement.model';

export class DisbursementMapper {
  static toDomain(model: DisbursementModel): Disbursement {
    return Disbursement.reconstitute({
      id: model.id,
      name: model.name,
      description: model.description ?? undefined,
      isActive: model.isActive,
      projectId: model.projectId,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    });
  }

  static toResponse(entity: Disbursement): DisbursementResponseDto {
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

  static toPersistence(entity: Disbursement): Partial<DisbursementModel> {
    return {
      id: entity.id,
      name: entity.name,
      description: entity.description ?? null,
      isActive: entity.isActive ?? true,
      projectId: entity.projectId,
    };
  }
}
