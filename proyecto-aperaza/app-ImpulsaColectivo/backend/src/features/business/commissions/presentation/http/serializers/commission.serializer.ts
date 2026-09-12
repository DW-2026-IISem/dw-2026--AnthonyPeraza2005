import { Commission } from '../../../domain/entities/commission.entity';
import { CommissionResponseDto } from '../../../application/dto/commission-response.dto';
import { CommissionMapper } from '../../../application/mappers/commission.mapper';

export class CommissionSerializer {
  static serialize(entity: Commission): CommissionResponseDto {
    return CommissionMapper.toResponse(entity);
  }
}
