import { Inject, Injectable } from '@nestjs/common';
import { ContributionNotFoundException } from '../../domain/exceptions/contribution-not-found.exception';
import {
  IContributionRepository,
  CONTRIBUTION_REPOSITORY,
} from '../../domain/interfaces/contribution-repository.interface';

@Injectable()
export class DeleteContributionUseCase {
  constructor(
    @Inject(CONTRIBUTION_REPOSITORY)
    private readonly contributionRepository: IContributionRepository,
  ) {}

  async execute(id: number): Promise<void> {
    const contribution = await this.contributionRepository.findById(id);
    if (!contribution) {
      throw new ContributionNotFoundException(id);
    }

    await this.contributionRepository.delete(id);
  }
}
