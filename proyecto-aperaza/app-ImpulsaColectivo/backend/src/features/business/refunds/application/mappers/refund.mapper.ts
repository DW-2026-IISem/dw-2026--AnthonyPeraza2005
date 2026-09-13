import { Refund } from '../../domain/entities/refund.entity';
import { RefundResponseDto } from '../dto/refund-response.dto';
import { RefundModel } from '../../infrastructure/persistence/models/refund.model';

export class RefundMapper {
  static toDomain(model: RefundModel): Refund {
    return Refund.reconstitute({
      id: model.id,
      referenceId: model.referenceId,
      date: model.date,
      reason: model.reason,
      total: Number(model.total),
      status: model.status,
    });
  }

  static toResponse(entity: Refund): RefundResponseDto {
    return {
      id: entity.id!,
      referenceId: entity.referenceId,
      date: entity.date,
      reason: entity.reason,
      total: entity.total,
      status: entity.status,
    };
  }

  static toPersistence(entity: Refund): Partial<RefundModel> {
    return {
      id: entity.id,
      referenceId: entity.referenceId,
      date: entity.date,
      reason: entity.reason,
      total: entity.total,
      status: entity.status,
    };
  }
}
