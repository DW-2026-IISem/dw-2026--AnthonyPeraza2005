import { Reward } from '../../../domain/entities/reward.entity';
import { RewardResponseDto } from '../../../application/dto/reward-response.dto';
import { RewardMapper } from '../../../application/mappers/reward.mapper';

export class RewardSerializer {
  static serialize(entity: Reward): RewardResponseDto {
    return RewardMapper.toResponse(entity);
  }
}
