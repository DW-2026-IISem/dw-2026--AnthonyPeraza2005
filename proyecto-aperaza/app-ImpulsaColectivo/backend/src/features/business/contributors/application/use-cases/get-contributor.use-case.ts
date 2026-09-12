import { Inject, Injectable } from '@nestjs/common';
import { ContributorNotFoundException } from '../../domain/exceptions/contributor-not-found.exception';
import {
  IContributorRepository,
  CONTRIBUTOR_REPOSITORY,
} from '../../domain/interfaces/contributor-repository.interface';
import { ContributorMapper } from '../mappers/contributor.mapper';

@Injectable()
export class GetContributorUseCase {
  constructor(
    @Inject(CONTRIBUTOR_REPOSITORY)
    private readonly contributorRepository: IContributorRepository,
  ) {}

  async execute(id: number) {
    const contributor = await this.contributorRepository.findById(id);
    if (!contributor) {
      throw new ContributorNotFoundException(id);
    }

    return ContributorMapper.toResponse(contributor);
  }
}
