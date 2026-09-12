import { Inject, Injectable } from '@nestjs/common';
import { ContributorNotFoundException } from '../../domain/exceptions/contributor-not-found.exception';
import {
  IContributorRepository,
  CONTRIBUTOR_REPOSITORY,
} from '../../domain/interfaces/contributor-repository.interface';
import { UpdateContributorDto } from '../dto/update-contributor.dto';
import { ContributorMapper } from '../mappers/contributor.mapper';

@Injectable()
export class UpdateContributorUseCase {
  constructor(
    @Inject(CONTRIBUTOR_REPOSITORY)
    private readonly contributorRepository: IContributorRepository,
  ) {}

  async execute(id: number, dto: UpdateContributorDto) {
    const contributor = await this.contributorRepository.findById(id);
    if (!contributor) {
      throw new ContributorNotFoundException(id);
    }

    contributor.update(dto);
    const updated = await this.contributorRepository.update(contributor);
    return ContributorMapper.toResponse(updated);
  }
}
