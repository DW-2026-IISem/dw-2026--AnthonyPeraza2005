import { Inject, Injectable } from '@nestjs/common';
import { ContributorNotFoundException } from '../../domain/exceptions/contributor-not-found.exception';
import {
  IContributorRepository,
  CONTRIBUTOR_REPOSITORY,
} from '../../domain/interfaces/contributor-repository.interface';

@Injectable()
export class DeleteContributorUseCase {
  constructor(
    @Inject(CONTRIBUTOR_REPOSITORY)
    private readonly contributorRepository: IContributorRepository,
  ) {}

  async execute(id: number): Promise<void> {
    const contributor = await this.contributorRepository.findById(id);
    if (!contributor) {
      throw new ContributorNotFoundException(id);
    }

    await this.contributorRepository.delete(id);
  }
}
