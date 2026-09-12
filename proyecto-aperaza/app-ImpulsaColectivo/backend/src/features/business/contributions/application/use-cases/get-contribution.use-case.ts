import { Inject, Injectable } from '@nestjs/common';
import { ContributionNotFoundException } from '../../domain/exceptions/contribution-not-found.exception';
import {
  IContributionRepository,
  CONTRIBUTION_REPOSITORY,
} from '../../domain/interfaces/contribution-repository.interface';
import { ContributionMapper } from '../mappers/contribution.mapper';

@Injectable()
export class GetContributionUseCase {
  constructor(
    @Inject(CONTRIBUTION_REPOSITORY)
    private readonly contributionRepository: IContributionRepository,
  ) {}

  async execute(id: number) {
    const contribution = await this.contributionRepository.findById(id);
    if (!contribution) {
      throw new ContributionNotFoundException(id);
    }

    return ContributionMapper.toResponse(contribution);
  }
}
