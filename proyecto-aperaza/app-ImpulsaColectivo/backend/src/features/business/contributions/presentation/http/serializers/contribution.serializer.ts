import { Contribution } from '../../../domain/entities/contribution.entity';
import { ContributionResponseDto } from '../../../application/dto/contribution-response.dto';
import { ContributionMapper } from '../../../application/mappers/contribution.mapper';

export class ContributionSerializer {
  static serialize(entity: Contribution): ContributionResponseDto {
    return ContributionMapper.toResponse(entity);
  }
}
