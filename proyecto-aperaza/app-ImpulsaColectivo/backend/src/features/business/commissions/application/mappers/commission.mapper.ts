import { Commission } from '../../domain/entities/commission.entity';
import { CommissionResponseDto } from '../dto/commission-response.dto';
import { CommissionModel } from '../../infrastructure/persistence/models/commission.model';

export class CommissionMapper {
  static toDomain(model: CommissionModel): Commission {
    return Commission.reconstitute({
      id: model.id,
      referenceId: model.referenceId,
      date: model.date,
      amount: Number(model.amount),
      status: model.status,
      notes: model.notes ?? undefined,
    });
  }

  static toResponse(entity: Commission): CommissionResponseDto {
    return {
      id: entity.id!,
      referenceId: entity.referenceId,
      date: entity.date,
      amount: entity.amount,
      status: entity.status,
      notes: entity.notes,
    };
  }

  static toPersistence(entity: Commission): Partial<CommissionModel> {
    return {
      id: entity.id,
      referenceId: entity.referenceId,
      date: entity.date,
      amount: entity.amount,
      status: entity.status,
      notes: entity.notes ?? null,
    };
  }
}
