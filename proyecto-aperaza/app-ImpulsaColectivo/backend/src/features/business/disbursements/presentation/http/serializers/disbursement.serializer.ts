import { Disbursement } from '../../../domain/entities/disbursement.entity';
import { DisbursementResponseDto } from '../../../application/dto/disbursement-response.dto';
import { DisbursementMapper } from '../../../application/mappers/disbursement.mapper';

export class DisbursementSerializer {
  static serialize(entity: Disbursement): DisbursementResponseDto {
    return DisbursementMapper.toResponse(entity);
  }
}
