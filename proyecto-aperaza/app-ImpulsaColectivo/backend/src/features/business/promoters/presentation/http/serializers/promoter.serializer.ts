import { Promoter } from '../../../domain/entities/promoter.entity';
import { PromoterResponseDto } from '../../../application/dto/promoter-response.dto';
import { PromoterMapper } from '../../../application/mappers/promoter.mapper';

export class PromoterSerializer {
  static serialize(entity: Promoter): PromoterResponseDto {
    return PromoterMapper.toResponse(entity);
  }
}
