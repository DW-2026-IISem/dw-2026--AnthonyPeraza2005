import { Refund } from '../../../domain/entities/refund.entity';
import { RefundResponseDto } from '../../../application/dto/refund-response.dto';
import { RefundMapper } from '../../../application/mappers/refund.mapper';

export class RefundSerializer {
  static serialize(entity: Refund): RefundResponseDto {
    return RefundMapper.toResponse(entity);
  }
}
