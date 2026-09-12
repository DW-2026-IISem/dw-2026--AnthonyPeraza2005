import { Contributor } from '../../../domain/entities/contributor.entity';
import { ContributorResponseDto } from '../../../application/dto/contributor-response.dto';
import { ContributorMapper } from '../../../application/mappers/contributor.mapper';

export class ContributorSerializer {
  static serialize(entity: Contributor): ContributorResponseDto {
    return ContributorMapper.toResponse(entity);
  }
}
